import { Body, Controller, Get, Header, HttpCode, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { TailoringService } from '../application/tailoring.service';
import { CreateTailorDto } from './dto/tailor.dto';

@Controller()
export class TailoringController {
  constructor(private service: TailoringService) {}

  @Post('jobs/:jobId/tailor') @HttpCode(202)
  tailor(@Param('jobId', ParseUUIDPipe) jobId: string, @Body() dto: CreateTailorDto) {
    return this.service.enqueue(dto.profileId, jobId, dto.force);
  }

  @Get('tailorings/:id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.get(id);
  }

  @Get('tailorings/:id/markdown')
  @Header('Content-Type', 'text/markdown; charset=utf-8')
  markdown(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.markdown(id);
  }
}
