import { ResumeJson } from '../../../resume/application/resume.schema';

export const period = (s: string, e: string | null) => `${s} – ${e ?? 'Atual'}`;
export const contactLine = (r: ResumeJson) =>
  [r.contact.email, r.contact.phone, r.contact.location, r.contact.linkedin, r.contact.github]
    .filter(Boolean).join(' · ');
