import { Entity, Column } from 'typeorm';
import { SurveySchemaInterface } from '../interfaces/survey';
import { BaseEntity } from './base.entity';
@Entity({ name: 'surveyConf' })
export class SurveyConf extends BaseEntity {
  @Column('jsonb')
  code: SurveySchemaInterface;

  @Column()
  pageId: string;
}
