import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'surveyMeta' })
export class SurveyMeta extends BaseEntity {
  @Column()
  title: string;

  @Column()
  remark: string;

  @Column()
  surveyType: string;

  @Column()
  surveyPath: string;

  @Column()
  creator: string;

  @Column()
  owner: string;

  @Column()
  ownerId: string;

  @Column()
  createMethod: string;

  @Column()
  createFrom: string;

  @Column()
  workspaceId: string;
}
