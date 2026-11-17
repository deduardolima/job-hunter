import { Inject, Injectable } from '@nestjs/common';
import {
  JOB_REPOSITORY,
  type JobRepositoryPort,
} from '../ports/job-repository.port';

@Injectable()
export class DeleteJobService {
  constructor(
    @Inject(JOB_REPOSITORY)
    private readonly jobRepository: JobRepositoryPort,
  ) {}

  execute(id: string) {
    return this.jobRepository.delete(id);
  }
}
