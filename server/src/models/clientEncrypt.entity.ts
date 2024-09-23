import { Entity, Column, Index, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ENCRYPT_TYPE } from '../enums/encrypt';
import { BaseEntity } from './base.entity';

@Entity({ name: 'clientEncrypt' })
export class ClientEncrypt extends BaseEntity {
  @Index({
    expireAfterSeconds: 3600,
  })
  @ObjectIdColumn()
  _id: ObjectId;

  @Column('jsonb')
  data: {
    secretKey?: string; // aes加密的密钥
    publicKey?: string; // rsa加密的公钥
    privateKey?: string; // rsa加密的私钥
  };

  @Column()
  type: ENCRYPT_TYPE;
}
