import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'surveyRecycle' })
export class SurveyRecycle extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'timestamp', precision: 3 })
  surveyMetaCreateAt: Date;

  @Column()
  ownerId: string;

  @Column()
  owner: string;

  @Column()
  pageId: string;

  @Column()
  foreverDeleted: boolean;

  @Column()
  isRecovered: boolean;

  @Column()
  operator: string;

  @Column()
  operatorId: string;

  @Column({ type: 'timestamp', precision: 3 })
  recoveredAt: Date;
}
