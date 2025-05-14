import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'surveyRecycleBin' })
export class SurveyRecycleBin extends BaseEntity {
  @Column()
  ownerId: string;

  @Column()
  owner: string;

  @Column()
  surveyTotal: number;
}
