import { Entity, Column } from 'typeorm';
import { HISTORY_TYPE } from '../enums';
import { SurveySchemaInterface } from '../interfaces/survey';
import { BaseEntity } from './base.entity';

@Entity({ name: 'surveyHistory' })
export class SurveyHistory extends BaseEntity {
  @Column()
  pageId: string;

  @Column()
  type: HISTORY_TYPE;

  @Column('jsonb')
  schema: SurveySchemaInterface;

  @Column('jsonb')
  operator: {
    username: string;
    _id: string;
  };

  @Column('string')
  sessionId: string;
}
