import { Inject, Injectable } from '@nestjs/common';
import {
  JOB_REPOSITORY,
  type JobRepositoryPort,
} from '../ports/job-repository.port';
import type { UpdateJobData } from '../types/job.types';

@Injectable()
export class UpdateJobService {
  constructor(
    @Inject(JOB_REPOSITORY)
    private readonly jobRepository: JobRepositoryPort,
  ) {}

  execute(id: string, data: UpdateJobData) {
    return this.jobRepository.update(id, data);
  }
}
