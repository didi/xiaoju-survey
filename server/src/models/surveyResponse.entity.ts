import {
  Entity,
  Column,
  ObjectIdColumn,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
} from 'typeorm';
import { ObjectId } from 'mongodb';
import { RECORD_STATUS } from '../enums';
import pluginManager from '../securityPlugin/pluginManager';

@Entity({ name: 'surveySubmit' })
export class SurveyResponse {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  pageId: string;

  @Column()
  surveyPath: string;

  @Column('jsonb')
  data: Record<string, any>;

  @Column()
  difTime: number;

  @Column()
  clientTime: number;

  @Column('jsonb')
  secretKeys: Array<string>;

  @Column('jsonb')
  optionTextAndId: Record<string, any>;

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
    pluginManager.triggerHook('beforeResponseDataCreate', this);
  }

  @BeforeUpdate()
  onUpdate() {
    this.updateDate = Date.now();
  }

  @AfterLoad()
  onDataLoaded() {
    pluginManager.triggerHook('afterResponseDataReaded', this);
  }
}
