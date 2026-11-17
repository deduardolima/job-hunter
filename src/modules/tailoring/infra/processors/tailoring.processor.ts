import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUES } from '../../../queue/application/queue.constants';
import { TailorJobData, TailoringService } from '../../application/tailoring.service';

// cada job faz até ~13 chamadas ao LLM
@Processor(QUEUES.TAILORING, { concurrency: 1, lockDuration: 5 * 60_000 })
export class TailoringProcessor extends WorkerHost {
  private readonly logger = new Logger(TailoringProcessor.name);
  constructor(private service: TailoringService) { super(); }

  process(job: Job<TailorJobData>) {
    return this.service.process(job.data.tailoringId, (p) => job.updateProgress(p));
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    this.logger.warn(`tailoring ${job.id} falhou: ${err.message}`);
  }
}
