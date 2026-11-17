import { Inject, Injectable } from '@nestjs/common';
import { PROFILE_REPOSITORY } from '../ports/profile-repository.port';
import type { ProfileRepositoryPort } from '../ports/profile-repository.port';

@Injectable()
export class FindProfileService {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepositoryPort,
  ) { }

  execute(id: string) {
    return this.profileRepository.findById(id);
  }
}