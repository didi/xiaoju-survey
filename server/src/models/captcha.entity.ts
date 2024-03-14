import { Entity, Column, Index, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { BaseEntity } from './base.entity';

@Entity({ name: 'captcha' })
export class Captcha extends BaseEntity {
  @Index({
    expireAfterSeconds:
      new Date(Date.now() + 2 * 60 * 60 * 1000).getTime() / 1000,
  })
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  text: string;
}
