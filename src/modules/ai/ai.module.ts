import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiController } from './infra/controllers/ai.controller';
import { GenerateTextService } from './application/services/generate-text.service';
import { OpenAiCompatibleProvider } from './infra/providers/openai-compatible.provider';
import { AI_PROVIDER } from './application/ports/ai-provider.port';



@Module({
  imports: [ConfigModule],
  controllers: [AiController],
  providers: [
    GenerateTextService,
    OpenAiCompatibleProvider,
    {
      provide: AI_PROVIDER,
      useExisting: OpenAiCompatibleProvider,
    },
  ],
  exports: [GenerateTextService],
})
export class AiModule { }
