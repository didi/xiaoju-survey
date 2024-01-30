import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ClientEncrypt } from 'src/models/clientEncrypt.entity';
import { ENCRYPT_TYPE } from 'src/enums/encrypt';
import { ObjectId } from 'mongodb';
import { RECORD_STATUS } from 'src/enums';

@Injectable()
export class ClientEncryptService {
  constructor(
    @InjectRepository(ClientEncrypt)
    private readonly clientEncryptRepository: MongoRepository<ClientEncrypt>,
  ) {}

  addAes({ secretKey }) {
    const encryptInfo = this.clientEncryptRepository.create({
      data: {
        secretKey,
      },
      type: ENCRYPT_TYPE.AES,
    });
    return this.clientEncryptRepository.save(encryptInfo);
  }

  addRsa({ publicKey, privateKey }) {
    const encryptInfo = this.clientEncryptRepository.create({
      data: {
        publicKey,
        privateKey,
      },
      type: ENCRYPT_TYPE.RSA,
    });
    return this.clientEncryptRepository.save(encryptInfo);
  }

  getEncryptInfoById(id) {
    return this.clientEncryptRepository.findOne({
      where: {
        _id: new ObjectId(id),
        'curStatus.status': {
          $ne: RECORD_STATUS.REMOVED,
        },
      },
    });
  }

  deleteEncryptInfo(id: string) {
    return this.clientEncryptRepository.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          curStatus: {
            status: RECORD_STATUS.REMOVED,
            date: Date.now(),
          },
        },
      },
    );
  }
}
