export const JOB_READER = Symbol('JOB_READER');
export interface JobSnapshot { id: string; title: string; company?: string; description: string }
export interface JobReaderPort {
  findById(id: string): Promise<JobSnapshot | null>;
  findAllIds(): Promise<string[]>;
}
