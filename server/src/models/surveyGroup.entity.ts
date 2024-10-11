import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'surveyGroup' })
export class SurveyGroup extends BaseEntity {
  @Column()
  ownerId: string;

  @Column()
  name: string;
}
