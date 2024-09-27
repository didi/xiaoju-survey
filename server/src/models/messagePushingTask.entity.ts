import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import {
  MESSAGE_PUSHING_TYPE,
  MESSAGE_PUSHING_HOOK,
} from 'src/enums/messagePushing';

@Entity({ name: 'messagePushingTask' })
export class MessagePushingTask extends BaseEntity {
  @Column()
  name: string;

  @Column()
  type: MESSAGE_PUSHING_TYPE;

  @Column()
  pushAddress: string; // 如果是http推送，则是http的链接

  @Column()
  triggerHook: MESSAGE_PUSHING_HOOK;

  @Column('jsonb')
  surveys: Array<string>;

  @Column()
  creatorId: string;

  @Column()
  ownerId: string;

  @Column()
  isDeleted: boolean;

  @Column()
  deletedAt: Date;

  @Column()
  operator: string;

  @Column()
  operatorId: string;
}
