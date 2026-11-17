import PDFDocument from 'pdfkit';
import { ResumeJson } from '../../../resume/application/resume.schema';
import { contactLine, period } from './format';

export function renderPdf(r: ResumeJson): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50, info: { Title: `${r.name} - Currículo` } });
    const chunks: Buffer[] = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const section = (title: string) => {
      doc.moveDown(0.8).font('Helvetica-Bold').fontSize(12).text(title.toUpperCase());
      const y = doc.y + 2;
      doc.moveTo(50, y).lineTo(545, y).lineWidth(0.5).stroke().moveDown(0.4);
      doc.font('Helvetica').fontSize(10);
    };

    doc.font('Helvetica-Bold').fontSize(18).text(r.name);
    if (r.headline) doc.font('Helvetica').fontSize(11).text(r.headline);
    doc.fontSize(9).fillColor('#444').text(contactLine(r)).fillColor('black');

    if (r.summary) { section('Resumo'); doc.text(r.summary, { align: 'justify' }); }

    if (r.experience.length) {
      section('Experiência');
      for (const e of r.experience) {
        doc.font('Helvetica-Bold').text(`${e.title} — ${e.company}`);
        doc.font('Helvetica-Oblique').fontSize(9)
          .text(`${period(e.start, e.end)}${e.location ? ` · ${e.location}` : ''}`);
        doc.font('Helvetica').fontSize(10);
        e.bullets.forEach((b) => doc.text(`•  ${b}`, { indent: 8 }));
        if (e.technologies.length) doc.fontSize(9).text(`Tecnologias: ${e.technologies.join(', ')}`).fontSize(10);
        doc.moveDown(0.5);
      }
    }

    if (r.education.length) {
      section('Formação');
      r.education.forEach((e) => doc.text(`${e.degree} — ${e.institution}${e.end ? ` (${e.end})` : ''}`));
    }
    if (r.skills.length) { section('Habilidades'); doc.text(r.skills.join(' · ')); }
    if (r.certifications.length) { section('Certificações'); r.certifications.forEach((c) => doc.text(`•  ${c}`)); }
    if (r.languages.length) { section('Idiomas'); r.languages.forEach((l) => doc.text(`${l.name}: ${l.level}`)); }

    doc.end();
  });
}
