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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateJobService } from '../../application/services/create-job.service';
import { DeleteJobService } from '../../application/services/delete-job.service';
import { FindAllJobsService } from '../../application/services/find-all-jobs.service';
import { FindJobService } from '../../application/services/find-job.service';
import { UpdateJobService } from '../../application/services/update-job.service';
import { CreateJobDto } from '../dtos/create-job.dto';
import { UpdateJobDto } from '../dtos/update-job.dto';
import type { CreateJobData } from '../../application/types/job.types';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(
    private readonly createJobService: CreateJobService,
    private readonly findAllJobsService: FindAllJobsService,
    private readonly findJobService: FindJobService,
    private readonly updateJobService: UpdateJobService,
    private readonly deleteJobService: DeleteJobService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Cadastrar uma vaga' })
  create(@Body() dto: CreateJobDto) {
    return this.createJobService.execute({
      title: dto.title,
      companyName: dto.companyName,
      description: dto.description,
      location: dto.location ?? null,
      workMode: dto.workMode ?? null,
      sourceUrl: dto.sourceUrl ?? null,
      postedAt: dto.postedAt ? new Date(dto.postedAt) : null,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Listar vagas' })
  findAll() {
    return this.findAllJobsService.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar vaga por ID' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const job = await this.findJobService.execute(id);

    if (!job) {
      throw new NotFoundException('Vaga não encontrada');
    }

    return job;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar vaga' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateJobDto,
  ) {
    const { postedAt, ...jobData } = dto;

    const job = await this.updateJobService.execute(id, {
      ...jobData,
      ...(postedAt !== undefined
        ? { postedAt: postedAt === null ? null : new Date(postedAt) }
        : {}),
    });

    if (!job) {
      throw new NotFoundException('Vaga não encontrada');
    }

    return job;
  }



  @Delete(':id')
  @ApiOperation({ summary: 'Excluir vaga' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const deleted = await this.deleteJobService.execute(id);

    if (!deleted) {
      throw new NotFoundException('Vaga não encontrada');
    }

    return { message: 'Vaga excluída com sucesso' };
  }
}
