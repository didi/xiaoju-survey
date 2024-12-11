import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { DELIVER_STATUS, DELIVER_TYPE } from '../enums/channel';

@Entity({ name: 'channel' })
export class Channel extends BaseEntity {
  @Column()
  ownerId: string;

  @Column()
  operatorId: string;

  @Column()
  name: string;
  
  @Column()
  type: DELIVER_TYPE;
  
  @Column()
  curStatus: {
    status: DELIVER_STATUS;
    date: Date;
  };

  @Column()
  statusList: Array<{
    status: DELIVER_STATUS;
    date: Date;
  }>;
}
