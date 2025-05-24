import { Entity, Column } from 'typeorm';
import { SurveySchemaInterface } from '../interfaces/survey';
import { BaseEntity } from './base.entity';
import { RECORD_STATUS, RECORD_SUB_STATUS } from '../enums';

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

  @Column()
  curStatus: {
    status: RECORD_STATUS;
    date: number;
  };

  @Column()
  subStatus: {
    status: RECORD_SUB_STATUS;
    date: number;
  };

  @Column()
  isDeleted: boolean;

  @Column()
  isCompleteDeleted: boolean;
}
