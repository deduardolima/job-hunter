import { BorderStyle, Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
import { ResumeJson } from '../../../resume/application/resume.schema';
import { contactLine, period } from './format';

const h = (text: string) => new Paragraph({
  text: text.toUpperCase(), heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 80 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '999999', space: 1 } },
});
const p = (text: string) => new Paragraph({ text });
const bullet = (text: string) => new Paragraph({ text, bullet: { level: 0 } });

export async function renderDocx(r: ResumeJson): Promise<Buffer> {
  const children: Paragraph[] = [
    new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun({ text: r.name, bold: true })] }),
    ...(r.headline ? [p(r.headline)] : []),
    new Paragraph({ children: [new TextRun({ text: contactLine(r), size: 18, color: '444444' })] }),
  ];

  if (r.summary) children.push(h('Resumo'), p(r.summary));
  if (r.experience.length) {
    children.push(h('Experiência'));
    for (const e of r.experience) {
      children.push(
        new Paragraph({ children: [new TextRun({ text: `${e.title} — ${e.company}`, bold: true })] }),
        new Paragraph({ children: [new TextRun({
          text: `${period(e.start, e.end)}${e.location ? ` · ${e.location}` : ''}`, italics: true, size: 18 })] }),
        ...e.bullets.map(bullet),
        ...(e.technologies.length
          ? [new Paragraph({ children: [new TextRun({ text: `Tecnologias: ${e.technologies.join(', ')}`, size: 18 })] })]
          : []),
      );
    }
  }
  if (r.education.length)
    children.push(h('Formação'), ...r.education.map((e) => p(`${e.degree} — ${e.institution}${e.end ? ` (${e.end})` : ''}`)));
  if (r.skills.length) children.push(h('Habilidades'), p(r.skills.join(' · ')));
  if (r.certifications.length) children.push(h('Certificações'), ...r.certifications.map(bullet));
  if (r.languages.length) children.push(h('Idiomas'), ...r.languages.map((l) => p(`${l.name}: ${l.level}`)));

  const doc = new Document({
    creator: 'job-hunter', title: `${r.name} - Currículo`,
    styles: { default: { document: { run: { font: 'Calibri', size: 21 } } } },
    sections: [{ properties: { page: { margin: { top: 900, bottom: 900, left: 1000, right: 1000 } } }, children }],
  });
  return Packer.toBuffer(doc);
}
