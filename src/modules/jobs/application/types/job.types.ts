export interface JobRecord {
  id: string;
  title: string;
  companyName: string;
  description: string;
  location: string | null;
  workMode: string | null;
  sourceUrl: string | null;
  postedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateJobData = Omit<
  JobRecord,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UpdateJobData = Partial<CreateJobData>;
