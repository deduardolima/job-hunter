import { ZodSchema } from 'zod';
import { GenerateTextService } from '../../../ai/application/services/generate-text.service';

export async function llmJson<T>(
  ai: GenerateTextService,
  prompt: string,
  schema: ZodSchema<T>,
): Promise<T> {
  const { text } = await ai.execute({ prompt });

  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`LLM não retornou JSON válido: ${cleaned.slice(0, 200)}`);
  }

  return schema.parse(parsed);
}
