import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUES } from '../../../queue/application/queue.constants';
import { MatchJobData, MatchingService } from '../../application/matching.service';

// concurrency baixa para respeitar o rate limit do provedor
@Processor(QUEUES.JOB_MATCH, { concurrency: 3, limiter: { max: 10, duration: 60_000 } })
export class JobMatchProcessor extends WorkerHost {
  private readonly logger = new Logger(JobMatchProcessor.name);
  constructor(private service: MatchingService) { super(); }

  process(job: Job<MatchJobData>) {
    return this.service.process(job.data.matchId);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    this.logger.warn(`match ${job.id} falhou (tentativa ${job.attemptsMade}): ${err.message}`);
  }
}
