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
    sessionId: string;
  }) {
    const { surveyId, schema, type, user, sessionId } = params;
    const newHistory = this.surveyHistory.create({
      pageId: surveyId,
      type,
      schema,
      operator: {
        _id: user._id.toString(),
        username: user.username,
        sessionId: sessionId,
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
        createDate: -1,
      },
      select: ['createDate', 'operator', 'type', '_id'],
    });
  }

  async getConflictList({
    surveyId,
    historyType,
    sessionId,
  }: {
    surveyId: string;
    historyType: HISTORY_TYPE;
    sessionId: string;
  }) {
    const result = await this.surveyHistory.find({
      where: {
        pageId: surveyId,
        type: historyType,
        // 排除掉sessionid相同的历史，这些保存不构成冲突
        'operator.sessionId': { $ne: sessionId },
      },
      order: { createDate: 'DESC' },
      take: 100,
      select: ['createDate', 'operator', 'type', '_id'],
    });

    return result;
  }

}
