import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('jobs')
export class JobEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ name: 'company_name', type: 'varchar', length: 200 })
  companyName!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  location!: string | null;

  @Column({ name: 'work_mode', type: 'varchar', length: 30, nullable: true })
  workMode!: string | null;

  @Column({ name: 'source_url', type: 'varchar', length: 1000, nullable: true })
  sourceUrl!: string | null;

  @Column({ name: 'posted_at', type: 'timestamptz', nullable: true })
  postedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
