export const QUEUES = {
  RESUME_INGEST: 'resume-ingest',
  JOB_MATCH: 'job-match',
  TAILORING: 'tailoring',
} as const;

export type QueueName = (typeof QUEUES)[keyof typeof QUEUES];

export const DEFAULT_JOB_OPTIONS = {
  attempts: 3,
  backoff: { type: 'exponential', delay: 5_000 },
  removeOnComplete: { age: 24 * 3600, count: 500 },
  removeOnFail: { age: 7 * 24 * 3600 },
};
