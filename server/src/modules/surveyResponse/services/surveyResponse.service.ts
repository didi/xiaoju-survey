import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { SurveyResponse } from 'src/models/surveyResponse.entity';

@Injectable()
export class SurveyResponseService {
  constructor(
    @InjectRepository(SurveyResponse)
    private readonly surveyResponseRepository: MongoRepository<SurveyResponse>,
  ) {}

  async createSurveyResponse({
    data,
    clientTime,
    diffTime,
    surveyId,
    surveyPath,
    optionTextAndId,
  }) {
    const newSubmitData = this.surveyResponseRepository.create({
      surveyPath,
      data,
      secretKeys: [],
      clientTime,
      diffTime,
      pageId: surveyId,
      optionTextAndId,
    });

    // 提交问卷
    const res = await this.surveyResponseRepository.save(newSubmitData);
    // res是加密后的数据，需要手动调用loaded才会触发解密
    res.onDataLoaded();
    return res;
  }

  async getSurveyResponseTotalByPath(surveyPath: string) {
    const data = await this.surveyResponseRepository.find({
      where: {
        surveyPath,
      },
    });
    return (data || []).length;
  }
}
