import { z } from 'zod';

export const ExperienceSchema = z.object({
  company: z.string(),
  title: z.string(),
  start: z.string(), // YYYY-MM
  end: z.string().nullable(), // null = atual
  location: z.string().optional(),
  bullets: z.array(z.string()),
  technologies: z.array(z.string()).default([]),
});

export const ResumeSchema = z.object({
  name: z.string(),
  headline: z.string().optional(),
  contact: z.object({
    email: z.string().optional(),
    phone: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    location: z.string().optional(),
  }),
  summary: z.string(),
  experience: z.array(ExperienceSchema),
  education: z.array(z.object({
    institution: z.string(),
    degree: z.string(),
    start: z.string().optional(),
    end: z.string().optional(),
  })),
  skills: z.array(z.string()),
  certifications: z.array(z.string()).default([]),
  languages: z.array(z.object({ name: z.string(), level: z.string() })).default([]),
});

export type ResumeJson = z.infer<typeof ResumeSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
