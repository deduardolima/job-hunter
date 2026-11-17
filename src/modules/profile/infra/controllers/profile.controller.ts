import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateProfileService } from '../../application/services/create-profile.service';
import { FindProfileService } from '../../application/services/find-profile.service';
import { UpdateProfileService } from '../../application/services/update-profile.service';
import { CreateProfileDto } from '../dtos/create-profile.dto';
import { UpdateProfileDto } from '../dtos/update-profile.dto';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfileController {
  constructor(
    private readonly createProfileService: CreateProfileService,
    private readonly findProfileService: FindProfileService,
    private readonly updateProfileService: UpdateProfileService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Criar perfil profissional' })
  create(@Body() dto: CreateProfileDto) {
    return this.createProfileService.execute({
      fullName: dto.fullName,
      professionalTitle: dto.professionalTitle ?? null,
      summary: dto.summary ?? null,
      location: dto.location ?? null,
      linkedinUrl: dto.linkedinUrl ?? null,
      portfolioUrl: dto.portfolioUrl ?? null,
      skills: dto.skills ?? [],
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar perfil por ID' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const profile = await this.findProfileService.execute(id);

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    return profile;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar perfil profissional' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProfileDto,
  ) {
    const profile = await this.updateProfileService.execute(id, dto);

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    return profile;
  }
}