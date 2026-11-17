import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { MatchRecord, MatchRepositoryPort } from '../../application/ports/match.repository.port';
import { JobMatchEntity } from '../entities/job-match.entity';

@Injectable()
export class MatchTypeormRepository implements MatchRepositoryPort {
  constructor(@InjectRepository(JobMatchEntity) private repo: Repository<JobMatchEntity>) {}

  create(data: Partial<MatchRecord>) { return this.repo.save(this.repo.create(data)); }
  async update(id: string, data: Partial<MatchRecord>) { await this.repo.update(id, data as any); }
  findById(id: string) { return this.repo.findOne({ where: { id } }); }

  findCompletedByHash(profileId: string, jobId: string, inputHash: string) {
    return this.repo.findOne({
      where: { profileId, jobId, inputHash, status: 'completed' },
      order: { createdAt: 'DESC' },
    });
  }

  /** Último match concluído por vaga, ordenado pela nota. */
  listByProfile(profileId: string, minScore?: number) {
    return this.repo.createQueryBuilder('m')
      .distinctOn(['m.jobId'])
      .where('m.profileId = :profileId', { profileId })
      .andWhere("m.status = 'completed'")
      .andWhere(minScore != null ? 'm.score >= :minScore' : '1=1', { minScore })
      .orderBy('m.jobId').addOrderBy('m.createdAt', 'DESC')
      .getMany()
      .then((rows) => rows.sort((a, b) => (b.score ?? 0) - (a.score ?? 0)));
  }
}
