import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { APPLICATION_REPOSITORY } from '../application/ports/application-repository.port';
import { CreateApplicationService } from '../application/services/create-application.service';
import { DeleteApplicationService } from '../application/services/delete-application.service';
import { FindAllApplicationsService } from '../application/services/find-all-applications.service';
import { FindApplicationService } from '../application/services/find-application.service';
import { UpdateApplicationService } from '../application/services/update-application.service';
import { ApplicationsController } from './controllers/applications.controller';
import { ApplicationEntity } from './entities/application.entity';
import { TypeOrmApplicationRepository } from './repositories/typeorm-application.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationEntity])],
  controllers: [ApplicationsController],
  providers: [
    CreateApplicationService,
    DeleteApplicationService,
    FindAllApplicationsService,
    FindApplicationService,
    UpdateApplicationService,
    TypeOrmApplicationRepository,
    {
      provide: APPLICATION_REPOSITORY,
      useExisting: TypeOrmApplicationRepository,
    },
  ],
  exports: [CreateApplicationService, FindApplicationService],
})
export class ApplicationsModule {}
