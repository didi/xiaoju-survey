import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'messagePushingLog' })
export class MessagePushingLog extends BaseEntity {
  @Column()
  taskId: string;

  @Column('jsonb')
  request: Record<string, any>;

  @Column('jsonb')
  response: Record<string, any>;

  @Column()
  status: number; // http状态码
}
