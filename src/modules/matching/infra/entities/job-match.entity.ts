import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { MatchResult } from '../../application/match.schema';
import type { MatchStatus } from '../../application/ports/match.repository.port';

@Entity('job_matches')
@Index(['profileId', 'jobId', 'inputHash'])
@Index(['profileId', 'score'])
export class JobMatchEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column('uuid') profileId: string;
  @Column('uuid') jobId: string;
  @Column({ type: 'varchar', length: 16, default: 'queued' }) status: MatchStatus;
  @Column({ type: 'char', length: 64 }) inputHash: string;
  @Column('jsonb', { nullable: true }) result: MatchResult | null;
  @Column('numeric', {
    precision: 3, scale: 1, nullable: true,
    transformer: { to: (v) => v, from: (v) => (v == null ? null : Number(v)) }
  })
  score: number | null;
  @Column('text', { nullable: true }) error: string | null;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
