import { Inject, Injectable } from '@nestjs/common';
import { PROFILE_REPOSITORY } from '../ports/profile-repository.port';
import type { ProfileRepositoryPort } from '../ports/profile-repository.port';
import { UpdateProfileData } from '../types/profile.types';

@Injectable()
export class UpdateProfileService {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepositoryPort,
  ) { }

  execute(id: string, data: UpdateProfileData) {
    return this.profileRepository.update(id, data);
  }
}