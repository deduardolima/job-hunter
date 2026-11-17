import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, StreamableFile } from '@nestjs/common';
import { ResumeExportService } from '../application/resume-export.service';
import { ExportQueryDto, LinkApplicationDto } from './dto/export.dto';

const MIME = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

@Controller('tailorings/:id')
export class ResumeExportController {
  constructor(private service: ResumeExportService) {}

  @Get('export')
  async export(@Param('id', ParseUUIDPipe) id: string, @Query() q: ExportQueryDto) {
    const { buffer, filename } = await this.service.export(id, q.format);
    return new StreamableFile(buffer, {
      type: MIME[q.format],
      disposition: `attachment; filename="${filename}"`,
    });
  }

  @Post('link-application')
  link(@Param('id', ParseUUIDPipe) id: string, @Body() dto: LinkApplicationDto) {
    return this.service.linkToApplication(id, dto.applicationId, dto.allowUnreviewed);
  }
}
