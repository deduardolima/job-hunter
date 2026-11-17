import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TailoringController } from './infra/tailoring.controller';
import { TailoredResumeEntity } from './infra/entities/tailored-resume.entity';
import { ResumeModule } from '../resume/resume.module';
import { MatchingModule } from '../matching/matching.module';
import { TailoringService } from './application/tailoring.service';
import { TailoringProcessor } from './infra/processors/tailoring.processor';
import { TAILORING_REPO } from './application/ports/tailoring.repository.port';
import { TailoringTypeormRepository } from './infra/repositories/tailoring.typeorm.repository';
import { AiModule } from '../ai/ai.module';


@Module({
  imports: [TypeOrmModule.forFeature([TailoredResumeEntity]), AiModule, ResumeModule, MatchingModule],
  controllers: [TailoringController],
  providers: [
    TailoringService,
    TailoringProcessor,
    { provide: TAILORING_REPO, useClass: TailoringTypeormRepository },
  ],
})
export class TailoringModule { }
