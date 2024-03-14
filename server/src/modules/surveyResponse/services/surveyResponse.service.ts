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
    difTime,
    surveyId,
    surveyPath,
    optionTextAndId,
  }) {
    const newSubmitData = this.surveyResponseRepository.create({
      surveyPath,
      data,
      secretKeys: [],
      clientTime,
      difTime,
      pageId: surveyId,
      optionTextAndId,
    });

    // 提交问卷
    return await this.surveyResponseRepository.save(newSubmitData);
  }

  async getSurveyResponseTotalByPath(surveyPath: string) {
    const count = await this.surveyResponseRepository.count({
      where: {
        surveyPath,
        'curStatus.status': {
          $ne: 'removed',
        },
      },
    });
    return count;
  }
}
