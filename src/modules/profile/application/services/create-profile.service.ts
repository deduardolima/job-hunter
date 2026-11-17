import { Inject, Injectable } from '@nestjs/common';
import { PROFILE_REPOSITORY } from '../ports/profile-repository.port';
import type { ProfileRepositoryPort } from '../ports/profile-repository.port';
import { CreateProfileData } from '../types/profile.types';

@Injectable()
export class CreateProfileService {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepositoryPort,
  ) { }

  execute(data: CreateProfileData) {
    return this.profileRepository.create(data);
  }
}