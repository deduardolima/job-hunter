import { Inject, Injectable } from '@nestjs/common';
import {
  APPLICATION_REPOSITORY,
  type ApplicationRepositoryPort,
} from '../ports/application-repository.port';
import type {
  ApplicationRecord,
  CreateApplicationData,
} from '../types/application.types';

@Injectable()
export class CreateApplicationService {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepositoryPort,
  ) {}

  execute(data: CreateApplicationData): Promise<ApplicationRecord> {
    return this.applicationRepository.create(data);
  }
}
