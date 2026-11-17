import { ResumeJson } from '../resume.schema';

export const MASTER_RESUME_REPO = Symbol('MASTER_RESUME_REPO');

export interface MasterResumeRecord {
  id: string;
  profileId: string;
  truthMarkdown: string | null;
  exclusions: string[];
  sourceText: string | null;
  base: ResumeJson | null;
  updatedAt: Date;
}

export interface MasterResumeRepositoryPort {
  findByProfile(profileId: string): Promise<MasterResumeRecord | null>;
  upsert(profileId: string, data: Partial<MasterResumeRecord>): Promise<MasterResumeRecord>;
}
