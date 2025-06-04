import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CHANNEL_STATUS, CHANNEL_TYPE } from '../enums/channel';

@Entity({ name: 'channel' })
export class Channel extends BaseEntity {
  @Column()
  ownerId: string;

  @Column()
  surveyId: string;

  @Column()
  operatorId: string;

  @Column()
  name: string;

  @Column()
  type: CHANNEL_TYPE;

  @Column()
  status: CHANNEL_STATUS;
}
