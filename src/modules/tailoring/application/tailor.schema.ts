import { z } from 'zod';

export const JobAnalysisSchema = z.object({
  mustHave: z.array(z.string()),
  niceToHave: z.array(z.string()),
  keywords: z.array(z.string()),
  seniority: z.string(),
  focus: z.string(),
});

export const FactCheckSchema = z.object({
  violations: z.array(z.object({ claim: z.string(), reason: z.string() })),
});

export const EditorReviewSchema = z.object({
  atsCoverage: z.number().min(0).max(100),
  issues: z.array(z.object({ section: z.string(), problem: z.string(), suggestion: z.string() })),
});

export const ManagerDecisionSchema = z.object({
  approved: z.boolean(),
  score: z.number().min(0).max(10),
  instructions: z.array(z.string()),
});

export type JobAnalysis = z.infer<typeof JobAnalysisSchema>;
export type FactCheck = z.infer<typeof FactCheckSchema>;
export type EditorReview = z.infer<typeof EditorReviewSchema>;
export type ManagerDecision = z.infer<typeof ManagerDecisionSchema>;

export interface IterationLog {
  iteration: number;
  violations: FactCheck['violations'];
  review?: EditorReview;
  decision?: ManagerDecision;
}
