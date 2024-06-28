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
    const data = this.whitelistVerifyRepo.create({
      surveyPath,
    });
    return await this.whitelistVerifyRepo.save(data);
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
