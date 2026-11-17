import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { createHash } from 'crypto';
import { QUEUES } from '../../queue/application/queue.constants';
import { ResumeService } from '../../resume/application/resume.service';
import { JOB_READER } from './ports/job-reader.port';
import { MATCH_REPO } from './ports/match.repository.port';
import type { JobReaderPort } from './ports/job-reader.port';
import type { MatchRepositoryPort } from './ports/match.repository.port';
import { matchPrompt } from './match.prompts';
import { MatchResult, MatchResultSchema } from './match.schema';
import { GenerateTextService } from '../../ai/application/services/generate-text.service';

export interface MatchJobData { matchId: string }

@Injectable()
export class MatchingService {
  constructor(
    @Inject(MATCH_REPO) private repo: MatchRepositoryPort,
    @Inject(JOB_READER) private jobs: JobReaderPort,
    @InjectQueue(QUEUES.JOB_MATCH) private queue: Queue<MatchJobData>,
    private resume: ResumeService,
    private ai: GenerateTextService,
  ) { }

  async enqueue(profileId: string, jobId: string, force = false) {
    const { truth, base, job } = await this.loadInputs(profileId, jobId);
    const inputHash = this.hash(truth, base, job.description);

    if (!force) {
      const cached = await this.repo.findCompletedByHash(profileId, jobId, inputHash);
      if (cached) return { matchId: cached.id, status: 'completed', cached: true };
    }

    const m = await this.repo.create({ profileId, jobId, inputHash, status: 'queued' });
    await this.queue.add('match', { matchId: m.id }, { jobId: m.id });
    return { matchId: m.id, status: 'queued', cached: false };
  }

  async enqueueBatch(profileId: string, jobIds?: string[], force = false) {
    const ids = jobIds?.length ? jobIds : await this.jobs.findAllIds();
    const results = [];
    for (const id of ids) {
      try { results.push({ jobId: id, ...(await this.enqueue(profileId, id, force)) }); }
      catch (e) { results.push({ jobId: id, status: 'rejected', error: (e as Error).message }); }
    }
    return results;
  }

  /** Executado pelo worker. */
  async process(matchId: string) {
    const m = await this.repo.findById(matchId);
    if (!m) throw new Error('Match inexistente');
    await this.repo.update(matchId, { status: 'processing', error: null });

    try {
      const { truth, base, job } = await this.loadInputs(m.profileId, m.jobId);
      const text = `${job.title}${job.company ? ` @ ${job.company}` : ''}\n\n${job.description}`;
      const result = this.normalize(await this.callJson(matchPrompt(truth, base, text)));
      await this.repo.update(matchId, { status: 'completed', result, score: result.score });
      return { matchId, score: result.score, verdict: result.verdict };
    } catch (e) {
      await this.repo.update(matchId, { status: 'failed', error: (e as Error).message });
      throw e;
    }
  }

  async get(id: string) {
    const m = await this.repo.findById(id);
    if (!m) throw new NotFoundException('Match não encontrado');
    return m;
  }

  ranking(profileId: string, minScore?: number) {
    return this.repo.listByProfile(profileId, minScore);
  }

  // ---------- helpers ----------
  private async loadInputs(profileId: string, jobId: string) {
    const master = await this.resume.get(profileId);
    if (!master.base) throw new BadRequestException('Gere o JSON base antes (etapa 1)');
    const job = await this.jobs.findById(jobId);
    if (!job) throw new NotFoundException(`Vaga ${jobId} não encontrada`);
    if (!job.description?.trim()) throw new BadRequestException(`Vaga ${jobId} sem descrição`);
    return { truth: master.truthMarkdown ?? '', base: master.base, job };
  }

  /** Regra determinística: um blocker nunca resulta em "apply". */
  private normalize(r: MatchResult): MatchResult {
    const hasBlocker = r.gaps.some((g) => g.severity === 'blocker');
    let verdict = r.verdict;
    if (hasBlocker && verdict === 'apply') verdict = 'maybe';
    if (r.score < 5) verdict = 'skip';
    return { ...r, score: Math.round(r.score * 10) / 10, verdict };
  }

  private async generate(prompt: string): Promise<string> {
    const { text } = await this.ai.execute({ prompt });
    return text;
  }

  private async callJson(prompt: string): Promise<MatchResult> {
    let raw = await this.generate(prompt);
    for (let i = 0; i < 2; i++) {
      try {
        const clean = raw.replace(/^```(?:json)?\s*|\s*```$/g, '').trim();
        return MatchResultSchema.parse(JSON.parse(clean));
      } catch (e) {
        if (i === 1) throw new Error('A IA retornou JSON inválido');
        raw = await this.generate(
          `Corrija para JSON válido (erro: ${(e as Error).message}), sem fatos novos:\n${raw}`,
        );
      }
    }
    throw new Error('unreachable');
  }

  private hash(...parts: unknown[]) {
    return createHash('sha256').update(JSON.stringify(parts)).digest('hex');
  }
}
