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
  status: DELIVER_STATUS;
}
