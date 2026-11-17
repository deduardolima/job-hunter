import { ResumeJson } from '../../../resume/application/resume.schema';

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

/** Checagem sem LLM: experiências e skills precisam existir na fonte. */
export function deterministicGuard(base: ResumeJson, truth: string, draft: ResumeJson) {
  const violations: { claim: string; reason: string }[] = [];
  const key = (e: { company: string; start: string }) => `${norm(e.company)}|${e.start}`;
  const baseExp = new Map(base.experience.map((e) => [key(e), e]));
  const source = norm(truth + JSON.stringify(base));

  for (const e of draft.experience) {
    const orig = baseExp.get(key(e));
    if (!orig) violations.push({ claim: `${e.company} (${e.start})`, reason: 'Experiência inexistente no base' });
    else if (norm(orig.title) !== norm(e.title) || orig.end !== e.end)
      violations.push({ claim: `${e.company}: ${e.title}`, reason: 'Cargo ou data alterados' });
  }
  for (const s of draft.skills)
    if (!source.includes(norm(s))) violations.push({ claim: s, reason: 'Skill sem evidência' });
  for (const c of draft.certifications)
    if (!source.includes(norm(c))) violations.push({ claim: c, reason: 'Certificação sem evidência' });

  if (draft.name !== base.name) violations.push({ claim: draft.name, reason: 'Nome alterado' });
  return violations;
}
