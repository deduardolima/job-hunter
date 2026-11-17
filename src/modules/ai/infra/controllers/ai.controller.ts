import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { GenerateTextService } from '../../application/services/generate-text.service';
import { GenerateTextDto } from '../dtos/generate-text.dto';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(
    private readonly generateTextService: GenerateTextService,
  ) {}

  @Post('generate')
  @ApiOperation({ summary: 'Gerar texto usando o provedor de IA configurado' })
  generate(@Body() dto: GenerateTextDto) {
    return this.generateTextService.execute({ prompt: dto.prompt });
  }
}
