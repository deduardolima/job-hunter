import { Inject, Injectable } from '@nestjs/common';

import {
  AI_PROVIDER,
  type AiProviderPort,
} from '../ports/ai-provider.port';
import type {
  GenerateTextCommand,
  GenerateTextResult,
} from '../types/ai.types';

@Injectable()
export class GenerateTextService {
  constructor(
    @Inject(AI_PROVIDER)
    private readonly aiProvider: AiProviderPort,
  ) {}

  execute(command: GenerateTextCommand): Promise<GenerateTextResult> {
    return this.aiProvider.generate(command.prompt);
  }
}
