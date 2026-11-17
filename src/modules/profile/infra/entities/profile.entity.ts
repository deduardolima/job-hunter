import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('profiles')
export class ProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'full_name', type: 'varchar', length: 160 })
  fullName: string;

  @Column({
    name: 'professional_title',
    type: 'varchar',
    length: 160,
    nullable: true,
  })
  professionalTitle: string | null;

  @Column({ type: 'text', nullable: true })
  summary: string | null;

  @Column({ type: 'varchar', length: 160, nullable: true })
  location: string | null;

  @Column({
    name: 'linkedin_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  linkedinUrl: string | null;

  @Column({
    name: 'portfolio_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  portfolioUrl: string | null;

  @Column({
    type: 'text',
    array: true,
    default: () => 'ARRAY[]::text[]',
  })
  skills: string[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}