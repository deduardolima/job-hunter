import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobEntity } from '../../../jobs/infra/entities/job.entity';
import { JobReaderPort, JobSnapshot } from '../../application/ports/job-reader.port';

@Injectable()
export class JobReaderTypeorm implements JobReaderPort {
  constructor(@InjectRepository(JobEntity) private repo: Repository<JobEntity>) {}

  async findById(id: string): Promise<JobSnapshot | null> {
    const j: any = await this.repo.findOne({ where: { id } as any });
    return j ? { id: j.id, title: j.title, company: j.company, description: j.description } : null;
  }

  async findAllIds() {
    return (await this.repo.find({ select: ['id'] as any })).map((j: any) => j.id);
  }
}
