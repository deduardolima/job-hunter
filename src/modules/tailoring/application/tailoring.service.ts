import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { createHash } from 'crypto';
import { JOB_READER } from '../../matching/application/ports/job-reader.port';
import type { JobReaderPort } from '../../matching/application/ports/job-reader.port';
import { QUEUES } from '../../queue/application/queue.constants';
import { ResumeJson, ResumeSchema } from '../../resume/application/resume.schema';
import { ResumeService } from '../../resume/application/resume.service';
import { deterministicGuard } from './agents/deterministic-guard';
import { llmJson } from './agents/llm-json';
import * as P from './agents/prompts';
import { renderMarkdown } from './markdown.renderer';
import { TAILORING_REPO } from './ports/tailoring.repository.port';
import type { TailoringRepositoryPort } from './ports/tailoring.repository.port';
import {
  EditorReviewSchema, FactCheckSchema, IterationLog, JobAnalysisSchema, ManagerDecisionSchema,
} from './tailor.schema';
import { GenerateTextService } from '../../ai/application/services/generate-text.service';

export interface TailorJobData { tailoringId: string }
type Progress = (p: number) => Promise<void>;

const MAX_ITERATIONS = 3;
const APPROVAL_SCORE = 8;

@Injectable()
export class TailoringService {
  constructor(
    @Inject(TAILORING_REPO) private repo: TailoringRepositoryPort,
    @Inject(JOB_READER) private jobs: JobReaderPort,
    @InjectQueue(QUEUES.TAILORING) private queue: Queue<TailorJobData>,
    private resume: ResumeService,
    private ai: GenerateTextService,
  ) { }

  async enqueue(profileId: string, jobId: string, force = false) {
    const { truth, base, jobText } = await this.loadInputs(profileId, jobId);
    const inputHash = createHash('sha256').update(JSON.stringify([truth, base, jobText])).digest('hex');

    if (!force) {
      const cached = await this.repo.findCompletedByHash(profileId, jobId, inputHash);
      if (cached) return { tailoringId: cached.id, status: cached.status, cached: true };
    }
    const t = await this.repo.create({ profileId, jobId, inputHash, status: 'queued', iterations: [] });
    // attempts: 1 — o ciclo já tem retentativas internas e é caro
    await this.queue.add('tailor', { tailoringId: t.id }, { jobId: t.id, attempts: 1 });
    return { tailoringId: t.id, status: 'queued', cached: false };
  }

  async process(id: string, progress: Progress) {
    const t = await this.repo.findById(id);
    if (!t) throw new Error('Tailoring inexistente');
    await this.repo.update(id, { status: 'processing', error: null });

    try {
      const { truth, base, jobText } = await this.loadInputs(t.profileId, t.jobId);

      // 1. Analista
      const analysis = await llmJson(this.ai, P.analystPrompt(jobText), JobAnalysisSchema);
      await this.repo.update(id, { analysis });
      await progress(10);

      const logs: IterationLog[] = [];
      let feedback: string[] = [];
      let best: { resume: ResumeJson; score: number } | null = null;
      let approved = false;

      for (let i = 1; i <= MAX_ITERATIONS && !approved; i++) {
        // 2. Redator
        const draft = await llmJson(this.ai, P.writerPrompt(truth, base, analysis, feedback), ResumeSchema);

        // 3. Verificador (código + IA)
        const fc = await llmJson(this.ai, P.factCheckPrompt(truth, base, draft), FactCheckSchema);
        const violations = [...deterministicGuard(base, truth, draft), ...fc.violations];
        const log: IterationLog = { iteration: i, violations };

        if (violations.length) {
          feedback = violations.map((v) => `Remova/corrija "${v.claim}": ${v.reason}`);
          logs.push(log);
          await this.saveProgress(id, logs, progress, i);
          continue;
        }

        // 4. Editor
        log.review = await llmJson(this.ai, P.editorPrompt(draft, analysis), EditorReviewSchema);
        // 5. Gerente
        log.decision = await llmJson(this.ai, P.managerPrompt(draft, log.review, analysis), ManagerDecisionSchema);
        logs.push(log);

        if (!best || log.decision.score > best.score) best = { resume: draft, score: log.decision.score };
        approved = log.decision.approved && log.decision.score >= APPROVAL_SCORE;
        feedback = [
          ...log.decision.instructions,
          ...log.review.issues.map((x) => `[${x.section}] ${x.suggestion}`),
        ];
        await this.saveProgress(id, logs, progress, i);
      }

      if (!best) throw new Error('Nenhum rascunho passou na verificação de fatos');

      await this.repo.update(id, {
        status: approved ? 'completed' : 'needs_review',
        resume: best.resume,
        markdown: renderMarkdown(best.resume),
        finalScore: best.score,
        iterations: logs,
      });
      await progress(100);
      return { tailoringId: id, approved, score: best.score, iterations: logs.length };
    } catch (e) {
      await this.repo.update(id, { status: 'failed', error: (e as Error).message });
      throw e;
    }
  }

  async get(id: string) {
    const t = await this.repo.findById(id);
    if (!t) throw new NotFoundException('Tailoring não encontrado');
    return t;
  }

  async markdown(id: string) {
    const t = await this.get(id);
    if (!t.markdown) throw new BadRequestException(`Status atual: ${t.status}`);
    return t.markdown;
  }

  private async saveProgress(id: string, logs: IterationLog[], progress: Progress, i: number) {
    await this.repo.update(id, { iterations: logs });
    await progress(10 + Math.round((i / MAX_ITERATIONS) * 85));
  }

  private async loadInputs(profileId: string, jobId: string) {
    const master = await this.resume.get(profileId);
    if (!master.base) throw new BadRequestException('Gere o JSON base antes (etapa 1)');
    const job = await this.jobs.findById(jobId);
    if (!job?.description?.trim()) throw new NotFoundException(`Vaga ${jobId} inexistente ou sem descrição`);
    const jobText = `${job.title}${job.company ? ` @ ${job.company}` : ''}\n\n${job.description}`;
    return { truth: master.truthMarkdown ?? '', base: master.base, jobText };
  }
}
