export const APPLICATION_LINKER = Symbol('APPLICATION_LINKER');
export interface ApplicationLinkerPort {
  /** Retorna false se a candidatura não existir. */
  link(applicationId: string, tailoringId: string, jobId: string): Promise<boolean>;
}
