import { Entity, Column, CreateDateColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { SurveySchemaInterface } from '../interfaces/survey';

@Entity({ name: 'surveyVersion' })
export class SurveyVersion extends BaseEntity {
  @Column()
  surveyId: string;

  @Column()
  versionNumber: number;

  @Column()
  title: string;

  @Column('jsonb')
  schema: SurveySchemaInterface;

  @Column()
  description: string;

  @Column()
  createdBy: string;

  @Column()
  createdById: string;

  @Column()
  changesSummary: string;

  @CreateDateColumn({ type: 'timestamp', precision: 3 })
  createdAt: Date;

  @Column()
  isCurrentVersion: boolean;

  @Column()
  tags: string[];
}
