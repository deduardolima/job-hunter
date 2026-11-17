export enum ApplicationStatus {
  SAVED = 'saved',
  APPLIED = 'applied',
  INTERVIEWING = 'interviewing',
  OFFER = 'offer',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

export interface ApplicationRecord {
  id: string;
  jobId: string;
  status: ApplicationStatus;
  appliedAt: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateApplicationData = Pick<
  ApplicationRecord,
  'jobId' | 'status' | 'appliedAt' | 'notes'
>;

export type UpdateApplicationData = Partial<CreateApplicationData>;
