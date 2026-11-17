import type { GenerateTextResult } from '../types/ai.types';

export const AI_PROVIDER = Symbol('AI_PROVIDER');

export interface AiProviderPort {
  generate(prompt: string): Promise<GenerateTextResult>;
}
