import { mongo } from '../db/mongo';
import { getStatusObject } from '../utils/index';
import { SURVEY_STATUS, HISTORY_TYPE, UserType } from '../../../types/index';

class SurveyHistoryService {
  async addHistory(surveyData: { surveyId: string, configData: unknown, type: HISTORY_TYPE, userData: UserType }) {
    const surveyHistory = await mongo.getCollection({ collectionName: 'surveyHistory' });
    const surveyHistoryRes = await surveyHistory.insertOne({
      curStatus: getStatusObject({ status: SURVEY_STATUS.new }),
      pageId: surveyData.surveyId,
      type: surveyData.type,
      code: {
        data: surveyData.configData
      },
      createDate: Date.now(),
      operator: {
        _id: surveyData.userData._id,
        username: surveyData.userData.username,
      }
    });
    return surveyHistoryRes;
  }

  async getHistoryList(historyParams: { surveyId: string, historyType: HISTORY_TYPE }) {
    const surveyHistory = await mongo.getCollection({ collectionName: 'surveyHistory' });
    const surveyHistoryListRes = await surveyHistory.find({
      pageId: historyParams.surveyId,
      type: historyParams.historyType,
    })
      .sort({ createDate: -1 })
      .limit(100)
      .toArray();
    return mongo.convertId2StringByList(surveyHistoryListRes);
  }
}

export const surveyHistoryService = new SurveyHistoryService();