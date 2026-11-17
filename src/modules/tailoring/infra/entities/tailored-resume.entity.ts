import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ResumeJson } from '../../../resume/application/resume.schema';
import { IterationLog, JobAnalysis } from '../../application/tailor.schema';
import type { TailorStatus } from '../../application/ports/tailoring.repository.port';

@Entity('tailored_resumes')
@Index(['profileId', 'jobId', 'inputHash'])
export class TailoredResumeEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column('uuid') profileId: string;
  @Column('uuid') jobId: string;
  @Column({ type: 'varchar', length: 16, default: 'queued' }) status: TailorStatus;
  @Column({ type: 'char', length: 64 }) inputHash: string;
  @Column('jsonb', { nullable: true }) analysis: JobAnalysis | null;
  @Column('jsonb', { nullable: true }) resume: ResumeJson | null;
  @Column('text', { nullable: true }) markdown: string | null;
  @Column('numeric', {
    precision: 3, scale: 1, nullable: true,
    transformer: { to: (v) => v, from: (v) => (v == null ? null : Number(v)) }
  })
  finalScore: number | null;
  @Column('jsonb', { default: () => "'[]'" }) iterations: IterationLog[];
  @Column('text', { nullable: true }) error: string | null;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
