import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationEntity } from '../../../applications/infra/entities/application.entity';
import { ApplicationLinkerPort } from '../../application/ports/application-linker.port';

@Injectable()
export class ApplicationLinkerTypeorm implements ApplicationLinkerPort {
  constructor(@InjectRepository(ApplicationEntity) private repo: Repository<ApplicationEntity>) {}

  async link(applicationId: string, tailoringId: string, jobId: string) {
    const app: any = await this.repo.findOne({ where: { id: applicationId } as any });
    if (!app) return false;
    if (app.jobId && app.jobId !== jobId)
      throw new BadRequestException('O currículo foi gerado para outra vaga');
    await this.repo.update(applicationId, { tailoredResumeId: tailoringId } as any);
    return true;
  }
}
