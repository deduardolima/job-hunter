import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeController } from './infra/resume.controller';
import { MasterResumeEntity } from './infra/entities/master-resume.entity';
import { MASTER_RESUME_REPO } from './application/ports/master-resume.repository.port';
import { TEXT_EXTRACTOR } from './application/ports/text-extractor.port';
import { TextExtractorAdapter } from './infra/adapters/text-extractor.adapter';
import { MasterResumeTypeormRepository } from './infra/repositories/master-resume.typeorm.repository';
import { ResumeService } from './application/resume.service';
import { AiModule } from '../ai/ai.module';


@Module({
  imports: [TypeOrmModule.forFeature([MasterResumeEntity]), AiModule],
  controllers: [ResumeController],
  providers: [
    ResumeService,
    { provide: MASTER_RESUME_REPO, useClass: MasterResumeTypeormRepository },
    { provide: TEXT_EXTRACTOR, useClass: TextExtractorAdapter },
  ],
  exports: [ResumeService],
})
export class ResumeModule { }
