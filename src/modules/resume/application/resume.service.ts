import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QUEUES } from '../../queue/application/queue.constants';
import { MASTER_RESUME_REPO } from './ports/master-resume.repository.port';
import { TEXT_EXTRACTOR } from './ports/text-extractor.port';
import type { TextExtractorPort } from './ports/text-extractor.port';
import type { MasterResumeRepositoryPort } from './ports/master-resume.repository.port';
import { extractionPrompt, repairPrompt } from './prompts';
import { ResumeJson, ResumeSchema } from './resume.schema';
import type { UploadedFileData } from '../infra/resume.controller';
import { GenerateTextService } from '../../ai/application/services/generate-text.service';

export interface IngestJobData { profileId: string; sourceText: string }

@Injectable()
export class ResumeService {
  constructor(
    @Inject(MASTER_RESUME_REPO) private repo: MasterResumeRepositoryPort,
    @Inject(TEXT_EXTRACTOR) private extractor: TextExtractorPort,
    @InjectQueue(QUEUES.RESUME_INGEST) private ingestQueue: Queue<IngestJobData>,
    private ai: GenerateTextService,
  ) { }

  saveTruth(profileId: string, truthMarkdown: string, exclusions: string[] = []) {
    return this.repo.upsert(profileId, { truthMarkdown, exclusions });
  }

  async get(profileId: string) {
    const r = await this.repo.findByProfile(profileId);
    if (!r) throw new NotFoundException('Currículo master não encontrado');
    return r;
  }

  /** Síncrono: valida e extrai texto. Assíncrono: chamada ao LLM. */
  async enqueueIngest(profileId: string, files: UploadedFileData[], force = false) {
    if (!files?.length) throw new BadRequestException('Envie ao menos um PDF ou DOCX');
    const current = await this.repo.findByProfile(profileId);
    if (current?.base && !force)
      throw new ConflictException('JSON base já existe. Use ?force=true para sobrescrever suas correções.');

    const texts = await Promise.all(
      files.map((f) => this.extractor.extract(f.buffer, f.mimetype, f.originalname)),
    );
    const sourceText = texts.join('\n\n---\n\n');
    await this.repo.upsert(profileId, { sourceText });

    const job = await this.ingestQueue.add('ingest', { profileId, sourceText });
    return { jobId: job.id, queue: QUEUES.RESUME_INGEST, status: 'queued' };
  }

  /** Executado pelo worker. */
  async processIngest(profileId: string, sourceText: string) {
    const current = await this.repo.findByProfile(profileId);
    const base = await this.extractJson(
      extractionPrompt(sourceText, current?.truthMarkdown ?? null, current?.exclusions ?? []),
    );
    return this.repo.upsert(profileId, { base });
  }

  async updateBase(profileId: string, base: unknown) {
    const parsed = ResumeSchema.safeParse(base);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());
    return this.repo.upsert(profileId, { base: parsed.data });
  }
  private async generate(prompt: string): Promise<string> {
    const { text } = await this.ai.execute({ prompt });
    return text;
  }

  private async extractJson(prompt: string): Promise<ResumeJson> {
    let raw = await this.generate(prompt);
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const clean = raw.replace(/^```(?:json)?\s*|\s*```$/g, '').trim();
        return ResumeSchema.parse(JSON.parse(clean));
      } catch (e) {
        if (attempt === 1) throw new Error('A IA retornou JSON inválido');
        raw = await this.generate(repairPrompt(raw, (e as Error).message));
      }
    }
    throw new Error('unreachable');
  }
}
