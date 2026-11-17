import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ResumeJson } from '../../application/resume.schema';

@Entity('master_resumes')
export class MasterResumeEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Index({ unique: true })
  @Column('uuid') profileId: string;

  @Column('text', { nullable: true }) truthMarkdown: string | null;
  @Column('jsonb', { default: () => "'[]'" }) exclusions: string[];
  @Column('text', { nullable: true }) sourceText: string | null;
  @Column('jsonb', { nullable: true }) base: ResumeJson | null;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
