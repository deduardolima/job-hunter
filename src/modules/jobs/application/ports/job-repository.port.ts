import type {
  CreateJobData,
  JobRecord,
  UpdateJobData,
} from '../types/job.types';

export const JOB_REPOSITORY = Symbol('JOB_REPOSITORY');

export interface JobRepositoryPort {
  create(data: CreateJobData): Promise<JobRecord>;
  findAll(): Promise<JobRecord[]>;
  findById(id: string): Promise<JobRecord | null>;
  update(id: string, data: UpdateJobData): Promise<JobRecord | null>;
  delete(id: string): Promise<boolean>;
}
