import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { APPLICATION_LINKER } from './ports/application-linker.port';
import type { ApplicationLinkerPort } from './ports/application-linker.port';
import type { ResumeExporterPort } from './ports/resume-exporter.port';
import { ExportFormat, RESUME_EXPORTER } from './ports/resume-exporter.port';
import { TailoringService } from './tailoring.service';

const slug = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '');

@Injectable()
export class ResumeExportService {
  constructor(
    private tailoring: TailoringService,
    @Inject(RESUME_EXPORTER) private exporter: ResumeExporterPort,
    @Inject(APPLICATION_LINKER) private linker: ApplicationLinkerPort,
  ) { }

  async export(id: string, format: ExportFormat) {
    const t = await this.tailoring.get(id);
    if (!t.resume) throw new BadRequestException(`Currículo indisponível (status: ${t.status})`);
    const buffer = await this.exporter.export(t.resume, format);
    return { buffer, filename: `CV_${slug(t.resume.name)}_${t.jobId.slice(0, 8)}.${format}` };
  }

  async linkToApplication(id: string, applicationId: string, allowUnreviewed = false) {
    const t = await this.tailoring.get(id);
    if (!t.resume) throw new BadRequestException(`Currículo indisponível (status: ${t.status})`);
    if (t.status === 'needs_review' && !allowUnreviewed)
      throw new BadRequestException('Currículo não aprovado pelo gerente. Revise ou envie allowUnreviewed=true');
    if (!(await this.linker.link(applicationId, id, t.jobId)))
      throw new NotFoundException('Candidatura não encontrada');
    return { applicationId, tailoringId: id, linked: true };
  }
}
