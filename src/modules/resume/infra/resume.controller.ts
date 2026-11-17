import {
  Body, Controller, Get, HttpCode, Param, ParseBoolPipe, ParseUUIDPipe,
  Patch, Post, Put, Query, UploadedFiles, UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ResumeService } from '../application/resume.service';
import { SaveTruthDto } from './dto/save-truth.dto';

export interface UploadedFileData {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Controller('profiles/:profileId')
export class ResumeController {
  constructor(private readonly service: ResumeService) { }

  @Put('truth')
  saveTruth(@Param('profileId', ParseUUIDPipe) id: string, @Body() dto: SaveTruthDto) {
    return this.service.saveTruth(id, dto.truthMarkdown, dto.exclusions);
  }

  @Post('resume/ingest')
  @HttpCode(202)
  @UseInterceptors(FilesInterceptor('files', 5, { limits: { fileSize: 5 * 1024 * 1024 } }))
  ingest(
    @Param('profileId', ParseUUIDPipe) id: string,
    @UploadedFiles() files: UploadedFileData[],
    @Query('force', new ParseBoolPipe({ optional: true })) force?: boolean,
  ) {
    return this.service.enqueueIngest(id, files ?? [], force ?? false);
  }

  @Get('resume')
  get(@Param('profileId', ParseUUIDPipe) id: string) {
    return this.service.get(id);
  }

  @Patch('resume')
  update(@Param('profileId', ParseUUIDPipe) id: string, @Body() base: unknown) {
    return this.service.updateBase(id, base);
  }
}
