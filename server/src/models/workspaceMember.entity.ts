import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'workspaceMember' })
export class WorkspaceMember extends BaseEntity {
  @Column()
  userId: string;

  @Column()
  workspaceId: string;

  @Column()
  role: string;

  @Column()
  creator: string;

  @Column()
  creatorId: string;

  @Column()
  operator: string;

  @Column()
  operatorId: string;
}
