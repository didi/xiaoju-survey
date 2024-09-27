import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'collaborator' })
export class Collaborator extends BaseEntity {
  @Column()
  surveyId: string;

  @Column()
  userId: string;

  @Column('jsonb')
  permissions: Array<string>;

  @Column()
  creator: string;

  @Column()
  creatorId: string;

  @Column()
  operator: string;

  @Column()
  operatorId: string;
}
