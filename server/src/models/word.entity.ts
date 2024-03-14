import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
@Entity({ name: 'word' })
export class Word extends BaseEntity {
  @Column()
  text: string;

  @Column()
  type: string;
}
