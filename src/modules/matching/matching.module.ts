import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MATCH_REPO } from './application/ports/match.repository.port';
import { MatchTypeormRepository } from './infra/repositories/match.typeorm.repository';
import { JobReaderTypeorm } from './infra/repositories/job-reader.typeorm';
import { JOB_READER } from './application/ports/job-reader.port';
import { MatchingService } from './application/matching.service';
import { MatchingController } from './infra/matching.controller';
import { JobMatchEntity } from './infra/entities/job-match.entity';
import { JobEntity } from '../jobs/infra/entities/job.entity';
import { ResumeModule } from '../resume/resume.module';
import { JobMatchProcessor } from './infra/processors/job-match.processor';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([JobMatchEntity, JobEntity]), AiModule, ResumeModule],
  controllers: [MatchingController],
  providers: [
    MatchingService,
    JobMatchProcessor,
    { provide: MATCH_REPO, useClass: MatchTypeormRepository },
    { provide: JOB_READER, useClass: JobReaderTypeorm },
  ],
  exports: [MatchingService, JOB_READER],
})
export class MatchingModule { }
