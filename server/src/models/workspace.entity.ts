import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'workspace' })
export class Workspace extends BaseEntity {
  @Column()
  creatorId: string;

  @Column()
  creator: string;

  @Column()
  ownerId: string;

  @Column()
  owner: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  operator: string;

  @Column()
  operatorId: string;

  @Column()
  isDeleted: boolean;

  @Column()
  deletedAt: Date;
}
