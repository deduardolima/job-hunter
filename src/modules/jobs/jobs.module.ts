import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsController } from './infra/controllers/jobs.controller';
import { JobEntity } from './infra/entities/job.entity';
import { CreateJobService } from './application/services/create-job.service';
import { DeleteJobService } from './application/services/delete-job.service';
import { FindAllJobsService } from './application/services/find-all-jobs.service';
import { FindJobService } from './application/services/find-job.service';
import { UpdateJobService } from './application/services/update-job.service';
import { JOB_REPOSITORY } from './application/ports/job-repository.port';
import { TypeOrmJobRepository } from './infra/repositories/typeorm-job.repository';



@Module({
  imports: [TypeOrmModule.forFeature([JobEntity])],
  controllers: [JobsController],
  providers: [
    CreateJobService,
    DeleteJobService,
    FindAllJobsService,
    FindJobService,
    UpdateJobService,
    TypeOrmJobRepository,
    {
      provide: JOB_REPOSITORY,
      useExisting: TypeOrmJobRepository,
    },
  ],
})
export class JobsModule { }
