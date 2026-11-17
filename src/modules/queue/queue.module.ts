import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QUEUES } from './application/queue.constants';
import { QueueStatusController } from './infra/queue-status.controller';
import { Redis } from 'ioredis';


const queues = Object.values(QUEUES).map((name) => ({ name }));


@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: new Redis(config.getOrThrow<string>('REDIS_URL'), {
          maxRetriesPerRequest: null,
        }),
      }),
    }),
    BullModule.registerQueue(...queues),
  ],
  controllers: [QueueStatusController],
  exports: [BullModule],
})
export class QueueModule { }
