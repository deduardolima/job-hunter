import { getQueueToken } from '@nestjs/bullmq';
import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Queue } from 'bullmq';
import { QUEUES, QueueName } from '../application/queue.constants';

@Controller('queues')
export class QueueStatusController {
  constructor(private moduleRef: ModuleRef) {}

  @Get(':queue/jobs/:id')
  async status(@Param('queue') queue: string, @Param('id') id: string) {
    if (!Object.values(QUEUES).includes(queue as QueueName))
      throw new NotFoundException('Fila inexistente');

    const q = this.moduleRef.get<Queue>(getQueueToken(queue), { strict: false });
    const job = await q.getJob(id);
    if (!job) throw new NotFoundException('Job não encontrado');

    return {
      id: job.id,
      state: await job.getState(),
      progress: job.progress,
      attempts: job.attemptsMade,
      result: job.returnvalue ?? null,
      error: job.failedReason ?? null,
      createdAt: new Date(job.timestamp),
      finishedAt: job.finishedOn ? new Date(job.finishedOn) : null,
    };
  }
}
