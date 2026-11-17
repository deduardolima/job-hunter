import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CreateApplicationService } from '../../application/services/create-application.service';
import { DeleteApplicationService } from '../../application/services/delete-application.service';
import { FindAllApplicationsService } from '../../application/services/find-all-applications.service';
import { FindApplicationService } from '../../application/services/find-application.service';
import { UpdateApplicationService } from '../../application/services/update-application.service';
import {
  ApplicationStatus,
  type CreateApplicationData,
  type UpdateApplicationData,
} from '../../application/types/application.types';
import { CreateApplicationDto } from '../dtos/create-application.dto';
import { UpdateApplicationDto } from '../dtos/update-application.dto';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationsController {
  constructor(
    private readonly createApplicationService: CreateApplicationService,
    private readonly findAllApplicationsService: FindAllApplicationsService,
    private readonly findApplicationService: FindApplicationService,
    private readonly updateApplicationService: UpdateApplicationService,
    private readonly deleteApplicationService: DeleteApplicationService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar uma candidatura' })
  create(@Body() dto: CreateApplicationDto) {
    const data: CreateApplicationData = {
      jobId: dto.jobId,
      status: dto.status ?? ApplicationStatus.SAVED,
      appliedAt: dto.appliedAt ? new Date(dto.appliedAt) : null,
      notes: dto.notes ?? null,
    };

    return this.createApplicationService.execute(data);
  }

  @Get()
  @ApiOperation({ summary: 'Listar candidaturas' })
  findAll() {
    return this.findAllApplicationsService.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar candidatura por ID' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const application = await this.findApplicationService.execute(id);

    if (!application) {
      throw new NotFoundException('Candidatura não encontrada');
    }

    return application;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar candidatura' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateApplicationDto,
  ) {
    const data: UpdateApplicationData = {
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.appliedAt !== undefined
        ? { appliedAt: dto.appliedAt ? new Date(dto.appliedAt) : null }
        : {}),
      ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
    };

    const application = await this.updateApplicationService.execute(id, data);

    if (!application) {
      throw new NotFoundException('Candidatura não encontrada');
    }

    return application;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover candidatura' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const deleted = await this.deleteApplicationService.execute(id);

    if (!deleted) {
      throw new NotFoundException('Candidatura não encontrada');
    }
  }
}
