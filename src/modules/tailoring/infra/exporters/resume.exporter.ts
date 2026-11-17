import { Injectable } from '@nestjs/common';
import { ResumeJson } from '../../../resume/application/resume.schema';
import { ExportFormat, ResumeExporterPort } from '../../application/ports/resume-exporter.port';
import { renderDocx } from './docx.exporter';
import { renderPdf } from './pdf.exporter';

@Injectable()
export class ResumeExporter implements ResumeExporterPort {
  export(r: ResumeJson, format: ExportFormat) {
    return format === 'pdf' ? renderPdf(r) : renderDocx(r);
  }
}
