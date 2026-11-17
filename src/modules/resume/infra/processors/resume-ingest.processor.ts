import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUES } from '../../../queue/application/queue.constants';
import { IngestJobData, ResumeService } from '../../application/resume.service';

@Processor(QUEUES.RESUME_INGEST, { concurrency: 2 })
export class ResumeIngestProcessor extends WorkerHost {
  private readonly logger = new Logger(ResumeIngestProcessor.name);

  constructor(private service: ResumeService) { super(); }

  async process(job: Job<IngestJobData>) {
    await job.updateProgress(10);
    const r = await this.service.processIngest(job.data.profileId, job.data.sourceText);
    await job.updateProgress(100);
    return { masterResumeId: r.id, profileId: r.profileId };
  }

  // nunca loga o conteúdo do currículo
  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    this.logger.warn(`job ${job.id} falhou (tentativa ${job.attemptsMade}): ${err.message}`);
  }
}
