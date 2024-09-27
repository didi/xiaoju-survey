import { Entity, Column, Index, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { BaseEntity } from './base.entity';

@Entity({ name: 'captcha' })
export class Captcha extends BaseEntity {
  @Index({
    expireAfterSeconds: 3600,
  })
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  text: string;
}
