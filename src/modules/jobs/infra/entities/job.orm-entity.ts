import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum WorkMode {
  REMOTE = 'remote',
  HYBRID = 'hybrid',
  ONSITE = 'onsite',
  UNKNOWN = 'unknown',
}

@Entity('jobs')
export class JobOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 180 })
  title: string;

  @Column({ type: 'varchar', length: 180 })
  company: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 2048, nullable: true })
  url: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  source: string | null;

  @Column({ type: 'varchar', length: 180, nullable: true })
  location: string | null;

  @Column({
    type: 'enum',
    enum: WorkMode,
    default: WorkMode.UNKNOWN,
  })
  workMode: WorkMode;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  salaryMin: string | null;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  salaryMax: string | null;

  @Column({ type: 'date', nullable: true })
  publishedAt: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
