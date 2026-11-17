import { ResumeJson } from '../../resume/application/resume.schema';

const period = (s: string, e: string | null) => `${s} – ${e ?? 'Atual'}`;

export function renderMarkdown(r: ResumeJson): string {
  const c = r.contact;
  const contact = [c.email, c.phone, c.location, c.linkedin, c.github].filter(Boolean).join(' · ');
  return [
    `# ${r.name}`, r.headline ? `**${r.headline}**` : '', contact, '',
    '## Resumo', r.summary, '',
    '## Experiência',
    ...r.experience.flatMap((e) => [
      `### ${e.title} — ${e.company}`, `*${period(e.start, e.end)}${e.location ? ` · ${e.location}` : ''}*`,
      ...e.bullets.map((b) => `- ${b}`),
      e.technologies.length ? `\n**Tecnologias:** ${e.technologies.join(', ')}` : '', '',
    ]),
    '## Formação',
    ...r.education.map((e) => `- **${e.degree}** — ${e.institution}${e.end ? ` (${e.end})` : ''}`), '',
    '## Habilidades', r.skills.join(' · '), '',
    ...(r.certifications.length ? ['## Certificações', ...r.certifications.map((x) => `- ${x}`), ''] : []),
    ...(r.languages.length ? ['## Idiomas', ...r.languages.map((l) => `- ${l.name}: ${l.level}`)] : []),
  ].filter((l) => l !== undefined).join('\n');
}
