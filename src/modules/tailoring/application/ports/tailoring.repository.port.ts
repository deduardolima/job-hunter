import { ResumeJson } from '../../../resume/application/resume.schema';
import { IterationLog, JobAnalysis } from '../tailor.schema';

export const TAILORING_REPO = Symbol('TAILORING_REPO');
export type TailorStatus = 'queued' | 'processing' | 'completed' | 'needs_review' | 'failed';

export interface TailoringRecord {
  id: string;
  profileId: string;
  jobId: string;
  status: TailorStatus;
  inputHash: string;
  analysis: JobAnalysis | null;
  resume: ResumeJson | null;
  markdown: string | null;
  finalScore: number | null;
  iterations: IterationLog[];
  error: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TailoringRepositoryPort {
  create(data: Partial<TailoringRecord>): Promise<TailoringRecord>;
  update(id: string, data: Partial<TailoringRecord>): Promise<void>;
  findById(id: string): Promise<TailoringRecord | null>;
  findCompletedByHash(profileId: string, jobId: string, hash: string): Promise<TailoringRecord | null>;
}
