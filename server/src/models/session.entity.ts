import { Entity, Column, Index, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { BaseEntity } from './base.entity';

@Entity({ name: 'session' })
export class Session extends BaseEntity {
  @Index({
    expireAfterSeconds: 3600,
  })
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  surveyId: string;

  @Column()
  userId: string;
}
