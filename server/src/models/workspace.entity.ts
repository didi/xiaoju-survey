import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'workspace' })
export class Workspace extends BaseEntity {
  @Column()
  ownerId: string;

  @Column()
  name: string;

  @Column()
  description: string;
}
