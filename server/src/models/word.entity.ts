import {
  Entity,
  Column,
  ObjectIdColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { ObjectId } from 'mongodb';
import { RECORD_STATUS } from '../enums';

@Entity({ name: 'word' })
export class Word {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  text: string;

  @Column()
  type: string;

  @Column()
  curStatus: {
    status: RECORD_STATUS;
    date: number;
  };

  @Column()
  statusList: Array<{
    status: RECORD_STATUS;
    date: number;
  }>;

  @Column()
  createDate: number;

  @Column()
  updateDate: number;

  @BeforeInsert()
  initDefaultInfo() {
    const now = Date.now();
    if (!this.curStatus) {
      const curStatus = { status: RECORD_STATUS.NEW, date: now };
      this.curStatus = curStatus;
      this.statusList = [curStatus];
    }
    this.createDate = now;
    this.updateDate = now;
  }

  @BeforeUpdate()
  onUpdate() {
    this.updateDate = Date.now();
  }
}
