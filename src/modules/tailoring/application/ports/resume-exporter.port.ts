import { ResumeJson } from '../../../resume/application/resume.schema';

export const RESUME_EXPORTER = Symbol('RESUME_EXPORTER');
export type ExportFormat = 'pdf' | 'docx';

export interface ResumeExporterPort {
  export(resume: ResumeJson, format: ExportFormat): Promise<Buffer>;
}
