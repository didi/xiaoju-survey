import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { SurveyHistory } from 'src/models/surveyHistory.entity';
import { HISTORY_TYPE } from 'src/enums';
import { SurveySchemaInterface } from 'src/interfaces/survey';

@Injectable()
export class SurveyHistoryService {
  constructor(
    @InjectRepository(SurveyHistory)
    private readonly surveyHistory: MongoRepository<SurveyHistory>,
  ) {}

  async addHistory(params: {
    surveyId: string;
    schema: SurveySchemaInterface;
    type: HISTORY_TYPE;
    user: any;
  }) {
    const { surveyId, schema, type, user } = params;
    const newHistory = this.surveyHistory.create({
      pageId: surveyId,
      type,
      schema,
      operator: {
        _id: user._id.toString(),
        username: user.username,
      },
    });
    return this.surveyHistory.save(newHistory);
  }

  async getHistoryList({
    surveyId,
    historyType,
  }: {
    surveyId: string;
    historyType: HISTORY_TYPE;
  }) {
    return this.surveyHistory.find({
      where: {
        pageId: surveyId,
        type: historyType,
      },
      take: 100,
      order: {
        createdAt: -1,
      },
      select: ['createdAt', 'operator', 'type', '_id'],
    });
  }
}
