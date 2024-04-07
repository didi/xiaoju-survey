import { Entity, Column } from 'typeorm';
import { SurveySchemaInterface } from '../interfaces/survey';
import { BaseEntity } from './base.entity';

@Entity({ name: 'surveyPublish' })
export class ResponseSchema extends BaseEntity {
  @Column()
  title: string;

  @Column()
  surveyPath: string;

  @Column('jsonb')
  code: SurveySchemaInterface;

  @Column()
  pageId: string;
}
