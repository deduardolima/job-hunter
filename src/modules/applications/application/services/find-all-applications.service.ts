import { Inject, Injectable } from '@nestjs/common';
import {
  APPLICATION_REPOSITORY,
  type ApplicationRepositoryPort,
} from '../ports/application-repository.port';
import type { ApplicationRecord } from '../types/application.types';

@Injectable()
export class FindAllApplicationsService {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepositoryPort,
  ) {}

  execute(): Promise<ApplicationRecord[]> {
    return this.applicationRepository.findAll();
  }
}
