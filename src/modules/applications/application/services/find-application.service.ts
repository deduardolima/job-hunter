import { Inject, Injectable } from '@nestjs/common';
import {
  APPLICATION_REPOSITORY,
  type ApplicationRepositoryPort,
} from '../ports/application-repository.port';
import type { ApplicationRecord } from '../types/application.types';

@Injectable()
export class FindApplicationService {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepositoryPort,
  ) {}

  execute(id: string): Promise<ApplicationRecord | null> {
    return this.applicationRepository.findById(id);
  }
}
