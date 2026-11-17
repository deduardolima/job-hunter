import { Inject, Injectable } from '@nestjs/common';
import {
  APPLICATION_REPOSITORY,
  type ApplicationRepositoryPort,
} from '../ports/application-repository.port';

@Injectable()
export class DeleteApplicationService {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: ApplicationRepositoryPort,
  ) {}

  execute(id: string): Promise<boolean> {
    return this.applicationRepository.delete(id);
  }
}
