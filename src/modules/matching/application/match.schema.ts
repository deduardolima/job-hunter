import { z } from 'zod';

export const MatchResultSchema = z.object({
  score: z.number().min(0).max(10),
  verdict: z.enum(['apply', 'maybe', 'skip']),
  justification: z.string(),
  matched: z.array(z.object({ requirement: z.string(), evidence: z.string() })),
  gaps: z.array(z.object({
    requirement: z.string(),
    severity: z.enum(['blocker', 'important', 'nice_to_have']),
  })),
  keywords: z.array(z.string()),
  seniorityFit: z.enum(['below', 'fit', 'above']),
});
export type MatchResult = z.infer<typeof MatchResultSchema>;
