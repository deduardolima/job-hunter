import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { TailoringRecord, TailoringRepositoryPort } from '../../application/ports/tailoring.repository.port';
import { TailoredResumeEntity } from '../entities/tailored-resume.entity';

@Injectable()
export class TailoringTypeormRepository implements TailoringRepositoryPort {
  constructor(@InjectRepository(TailoredResumeEntity) private repo: Repository<TailoredResumeEntity>) {}

  create(data: Partial<TailoringRecord>) { return this.repo.save(this.repo.create(data)); }
  async update(id: string, data: Partial<TailoringRecord>) { await this.repo.update(id, data as any); }
  findById(id: string) { return this.repo.findOne({ where: { id } }); }

  findCompletedByHash(profileId: string, jobId: string, inputHash: string) {
    return this.repo.findOne({
      where: { profileId, jobId, inputHash, status: In(['completed', 'needs_review']) },
      order: { createdAt: 'DESC' },
    });
  }
}
