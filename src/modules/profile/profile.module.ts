import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './infra/controllers/profile.controller';
import { ProfileEntity } from './infra/entities/profile.entity';
import { CreateProfileService } from './application/services/create-profile.service';
import { FindProfileService } from './application/services/find-profile.service';
import { UpdateProfileService } from './application/services/update-profile.service';
import { TypeOrmProfileRepository } from './infra/repositories/typeorm-profile.repository';
import { PROFILE_REPOSITORY } from './application/ports/profile-repository.port';



@Module({
  imports: [TypeOrmModule.forFeature([ProfileEntity])],
  controllers: [ProfileController],
  providers: [
    CreateProfileService,
    FindProfileService,
    UpdateProfileService,
    TypeOrmProfileRepository,
    {
      provide: PROFILE_REPOSITORY,
      useExisting: TypeOrmProfileRepository,
    },
  ],
})
export class ProfileModule { }