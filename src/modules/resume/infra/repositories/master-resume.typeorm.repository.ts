import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MasterResumeRecord, MasterResumeRepositoryPort } from '../../application/ports/master-resume.repository.port';
import { MasterResumeEntity } from '../entities/master-resume.entity';

@Injectable()
export class MasterResumeTypeormRepository implements MasterResumeRepositoryPort {
  constructor(@InjectRepository(MasterResumeEntity) private repo: Repository<MasterResumeEntity>) {}

  findByProfile(profileId: string) {
    return this.repo.findOne({ where: { profileId } });
  }

  async upsert(profileId: string, data: Partial<MasterResumeRecord>) {
    const existing = await this.repo.findOne({ where: { profileId } });
    const entity = this.repo.merge(existing ?? this.repo.create({ profileId }), data);
    return this.repo.save(entity);
  }
}
