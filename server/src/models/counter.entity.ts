import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'counter' })
export class Counter extends BaseEntity {
  @Column()
  key: string;

  @Column()
  surveyPath: string;

  @Column()
  type: string;

  @Column('jsonb')
  data: Record<string, any>;
}
