import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { JobRepositoryPort } from '../../application/ports/job-repository.port';
import type {
  CreateJobData,
  JobRecord,
  UpdateJobData,
} from '../../application/types/job.types';
import { JobEntity } from '../entities/job.entity';

@Injectable()
export class TypeOrmJobRepository implements JobRepositoryPort {
  constructor(
    @InjectRepository(JobEntity)
    private readonly repository: Repository<JobEntity>,
  ) { }

  async create(data: CreateJobData): Promise<JobRecord> {
    const job = this.repository.create(data);
    return this.repository.save(job);
  }

  async findAll(): Promise<JobRecord[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<JobRecord | null> {
    return this.repository.findOneBy({ id });
  }

  async update(
    id: string,
    data: UpdateJobData,
  ): Promise<JobRecord | null> {
    const job = await this.repository.findOneBy({ id });

    if (!job) {
      return null;
    }

    Object.assign(job, data);
    return this.repository.save(job);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}

