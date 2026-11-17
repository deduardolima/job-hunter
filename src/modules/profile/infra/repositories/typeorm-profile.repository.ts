import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProfileRepositoryPort } from '../../application/ports/profile-repository.port';
import {
  CreateProfileData,
  ProfileRecord,
  UpdateProfileData,
} from '../../application/types/profile.types';
import { ProfileEntity } from '../entities/profile.entity';

@Injectable()
export class TypeOrmProfileRepository implements ProfileRepositoryPort {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly repository: Repository<ProfileEntity>,
  ) { }

  async create(data: CreateProfileData): Promise<ProfileRecord> {
    const profile = this.repository.create(data);
    return this.repository.save(profile);
  }

  async findById(id: string): Promise<ProfileRecord | null> {
    return this.repository.findOneBy({ id });
  }

  async update(
    id: string,
    data: UpdateProfileData,
  ): Promise<ProfileRecord | null> {
    const profile = await this.repository.findOneBy({ id });

    if (!profile) {
      return null;
    }

    Object.assign(profile, data);
    return this.repository.save(profile);
  }
}