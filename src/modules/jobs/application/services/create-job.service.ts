import { Inject, Injectable } from '@nestjs/common';
import {
  JOB_REPOSITORY,
  type JobRepositoryPort,
} from '../ports/job-repository.port';
import type { CreateJobData } from '../types/job.types';

@Injectable()
export class CreateJobService {
  constructor(
    @Inject(JOB_REPOSITORY)
    private readonly jobRepository: JobRepositoryPort,
  ) {}

  execute(data: CreateJobData) {
    return this.jobRepository.create(data);
  }
}
