import {
  Entity,
  Column,
  Index,
  ObjectIdColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { ObjectId } from 'mongodb';
import { RECORD_STATUS } from '../enums';
import { ENCRYPT_TYPE } from '../enums/encrypt';

@Entity({ name: 'clientEncrypt' })
export class ClientEncrypt {
  @Index({
    expireAfterSeconds:
      new Date(Date.now() + 2 * 60 * 60 * 1000).getTime() / 1000,
  })
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

  @Column('jsonb')
  data: {
    secretKey?: string; // aes加密的密钥
    publicKey?: string; // rsa加密的公钥
    privateKey?: string; // rsa加密的私钥
  };

  @Column()
  type: ENCRYPT_TYPE;

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
