import { Body, Controller, Get, HttpCode, Param, ParseFloatPipe, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { MatchingService } from '../application/matching.service';
import { BatchMatchDto, CreateMatchDto } from './dto/match.dto';

@Controller()
export class MatchingController {
  constructor(private service: MatchingService) {}

  @Post('jobs/:jobId/match') @HttpCode(202)
  match(@Param('jobId', ParseUUIDPipe) jobId: string, @Body() dto: CreateMatchDto) {
    return this.service.enqueue(dto.profileId, jobId, dto.force);
  }

  @Post('matches/batch') @HttpCode(202)
  batch(@Body() dto: BatchMatchDto) {
    return this.service.enqueueBatch(dto.profileId, dto.jobIds, dto.force);
  }

  @Get('matches/:id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.get(id);
  }

  @Get('profiles/:profileId/matches')
  ranking(
    @Param('profileId', ParseUUIDPipe) profileId: string,
    @Query('minScore', new ParseFloatPipe({ optional: true })) minScore?: number,
  ) {
    return this.service.ranking(profileId, minScore);
  }
}
