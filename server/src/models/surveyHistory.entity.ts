import {
  Entity,
  Column,
  ObjectIdColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { ObjectId } from 'mongodb';
import { HISTORY_TYPE, RECORD_STATUS } from '../enums';
import { SurveySchemaInterface } from '../interfaces/survey';

@Entity({ name: 'surveyHistory' })
export class SurveyHistory {
  @ObjectIdColumn()
  _id: ObjectId;

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

  @Column()
  pageId: string;

  @Column()
  type: HISTORY_TYPE;

  @Column('jsonb')
  schema: SurveySchemaInterface;

  @Column('jsonb')
  operator: {
    username: string;
    _id: string;
  };

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
