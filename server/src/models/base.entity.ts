import { Column, ObjectIdColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { ObjectId } from 'mongodb';
import { RECORD_STATUS, RECORD_SUB_STATUS } from '../enums';

export class BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  curStatus: {
    // 兼容子状态
    status: RECORD_STATUS | RECORD_SUB_STATUS;
    date: number;
  };

  @Column()
  subCurStatus: {
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
    if (!this.subCurStatus) {
      const subCurStatus = { status: RECORD_SUB_STATUS.DEFAULT, date: now };
      this.subCurStatus = subCurStatus;
    }
    this.createDate = now;
    this.updateDate = now;
  }

  @BeforeUpdate()
  onUpdate() {
    this.updateDate = Date.now();
  }
}
