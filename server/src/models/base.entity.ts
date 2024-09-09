import { Column, ObjectIdColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { ObjectId } from 'mongodb';
import { RECORD_STATUS, RECORD_SUB_STATUS } from '../enums';

export class BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  curStatus: {
    status: RECORD_STATUS;
    date: number;
  };

  @Column()
  subStatus: {
    status: RECORD_SUB_STATUS;
    date: number;
  };

  @Column()
  statusList: Array<{
    status: RECORD_STATUS | RECORD_SUB_STATUS;
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
    if (!this.subStatus) {
      const subStatus = { status: RECORD_SUB_STATUS.DEFAULT, date: now };
      this.subStatus = subStatus;
    }
    this.createDate = now;
    this.updateDate = now;
  }

  @BeforeUpdate()
  onUpdate() {
    this.updateDate = Date.now();
  }
}
