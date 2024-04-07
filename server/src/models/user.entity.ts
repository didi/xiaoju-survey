import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Column()
  username: string;

  @Column()
  password: string;
}
