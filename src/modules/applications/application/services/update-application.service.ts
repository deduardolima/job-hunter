import { Inject, Injectable } from '@nestjs/common';
import {
  APPLICATION_REPOSITORY,
  type ApplicationRepositoryPort,
} from '../ports/application-repository.port';
import type {
  ApplicationRecord,
  UpdateApplicationData,
} from '../types/application.types';

@Injectable()
export class UpdateApplicationService {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepositoryPort,
  ) {}

  execute(
    id: string,
    data: UpdateApplicationData,
  ): Promise<ApplicationRecord | null> {
    return this.applicationRepository.update(id, data);
  }
}
