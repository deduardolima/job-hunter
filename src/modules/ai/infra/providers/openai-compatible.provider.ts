import {
  BadGatewayException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { AiProviderPort } from '../../application/ports/ai-provider.port';
import type { GenerateTextResult } from '../../application/types/ai.types';

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
}

@Injectable()
export class OpenAiCompatibleProvider implements AiProviderPort {
  constructor(private readonly configService: ConfigService) {}

  async generate(prompt: string): Promise<GenerateTextResult> {
    const apiKey = this.configService.get<string>('AI_API_KEY');

    if (!apiKey) {
      throw new ServiceUnavailableException(
        'AI_API_KEY não está configurada.',
      );
    }

    const baseUrl =
      this.configService.get<string>('AI_BASE_URL') ??
      'https://api.openai.com/v1';
    const model =
      this.configService.get<string>('AI_MODEL') ?? 'gpt-4o-mini';
    const endpoint = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;

    let response: Response;

    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
        }),
        signal: AbortSignal.timeout(30_000),
      });
    } catch {
      throw new BadGatewayException(
        'Não foi possível conectar ao provedor de IA.',
      );
    }

    if (!response.ok) {
      throw new BadGatewayException(
        `O provedor de IA respondeu com status ${response.status}.`,
      );
    }

    const data = (await response.json()) as ChatCompletionResponse;
    const text = data.choices?.[0]?.message?.content?.trim();

    if (!text) {
      throw new BadGatewayException(
        'O provedor de IA retornou uma resposta vazia.',
      );
    }

    return { text };
  }
}
