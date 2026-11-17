import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { ProfileModule } from './modules/profile/profile.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { ApplicationsModule } from './modules/applications/infra/applications.module';
import { ResumeModule } from './modules/resume/resume.module';
import { QueueModule } from './modules/queue/queue.module';
import { TailoringModule } from './modules/tailoring/tailoring.module';
import { MatchingModule } from './modules/matching/matching.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'test', 'production')
          .default('development'),
        PORT: Joi.number().port().default(3000),
        API_PREFIX: Joi.string().default('api/v1'),
        CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
        DATABASE_URL: Joi.string()
          .uri({ scheme: ['postgres', 'postgresql'] })
          .required(),
      })
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.getOrThrow<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        retryAttempts: 10,
        retryDelay: 3000,
      }),
    }),
    QueueModule,
    TailoringModule,
    MatchingModule,
    ResumeModule,
    ProfileModule,
    JobsModule,
    ApplicationsModule,
    AiModule,
  ],
})
export class AppModule { }

