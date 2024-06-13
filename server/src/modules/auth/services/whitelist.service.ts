import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { WhitelistVerify } from 'src/models/whitelistVerify.entity';

@Injectable()
export class WhitelistService {
  constructor(
    @InjectRepository(WhitelistVerify)
    private readonly whitelistVerifyRepo: MongoRepository<WhitelistVerify>,
  ) {}

  // 创建
  async create(surveyPath: string) {
    return await this.whitelistVerifyRepo.create({
      surveyPath,
    });
  }

  // 匹配
  async match(surveyPath: string, verifyId: string) {
    return await this.whitelistVerifyRepo.findOne({
      where: {
        surveyPath,
        _id: verifyId,
      },
    });
  }
}
