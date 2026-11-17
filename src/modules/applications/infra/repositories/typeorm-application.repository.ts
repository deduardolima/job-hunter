import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { ApplicationRepositoryPort } from '../../application/ports/application-repository.port';
import type {
  ApplicationRecord,
  CreateApplicationData,
  UpdateApplicationData,
} from '../../application/types/application.types';
import { ApplicationEntity } from '../entities/application.entity';

@Injectable()
export class TypeOrmApplicationRepository
  implements ApplicationRepositoryPort
{
  constructor(
    @InjectRepository(ApplicationEntity)
    private readonly repository: Repository<ApplicationEntity>,
  ) {}

  async create(data: CreateApplicationData): Promise<ApplicationRecord> {
    const application = this.repository.create(data);
    return this.repository.save(application);
  }

  findAll(): Promise<ApplicationRecord[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  findById(id: string): Promise<ApplicationRecord | null> {
    return this.repository.findOneBy({ id });
  }

  async update(
    id: string,
    data: UpdateApplicationData,
  ): Promise<ApplicationRecord | null> {
    const application = await this.repository.findOneBy({ id });

    if (!application) {
      return null;
    }

    Object.assign(application, data);
    return this.repository.save(application);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
