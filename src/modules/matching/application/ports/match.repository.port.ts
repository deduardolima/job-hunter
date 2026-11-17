import { MatchResult } from '../match.schema';

export const MATCH_REPO = Symbol('MATCH_REPO');
export type MatchStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface MatchRecord {
  id: string;
  profileId: string;
  jobId: string;
  status: MatchStatus;
  inputHash: string;
  result: MatchResult | null;
  score: number | null;
  error: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchRepositoryPort {
  create(data: Partial<MatchRecord>): Promise<MatchRecord>;
  update(id: string, data: Partial<MatchRecord>): Promise<void>;
  findById(id: string): Promise<MatchRecord | null>;
  findCompletedByHash(profileId: string, jobId: string, hash: string): Promise<MatchRecord | null>;
  listByProfile(profileId: string, minScore?: number): Promise<MatchRecord[]>;
}
