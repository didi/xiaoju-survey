import { Entity, Column, BeforeInsert } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RECORD_STATUS, RECORD_SUB_STATUS } from '../enums';

@Entity({ name: 'surveyMeta' })
export class SurveyMeta extends BaseEntity {
  @Column()
  title: string;

  @Column()
  remark: string;

  @Column()
  surveyType: string;

  @Column()
  surveyPath: string;

  @Column()
  creator: string;

  @Column()
  creatorId: string;

  @Column()
  owner: string;

  @Column()
  ownerId: string;

  @Column()
  createMethod: string;

  @Column()
  createFrom: string;

  @Column()
  workspaceId: string;

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
  operator: string;

  @Column()
  operatorId: string;

  @Column()
  isDeleted: boolean;

  @Column()
  deletedAt: Date;

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
  }
}
