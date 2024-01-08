import { SurveyApp, SurveyServer } from '../../decorator';
import { surveyService } from './service/surveyService';
import { userService } from './service/userService';
import { surveyHistoryService } from './service/surveyHistoryService';
import { HISTORY_TYPE } from '../../types/index';
import { getValidateValue } from './utils/index';
import * as Joi from 'joi';

@SurveyApp('/api/surveyManage')
export default class SurveyManage {

  @SurveyServer({ type: 'http', method: 'get', routerName: '/getBannerData' })
  async getBannerData() {
    const data = await surveyService.getBannerData();
    return {
      code: 200,
      data,
    };
  }

  @SurveyServer({ type: 'http', method: 'post', routerName: '/add' })
  async add({ req }) {
    const params = getValidateValue(Joi.object({
      remark: Joi.string().required(),
      questionType: Joi.string().required(),
      title: Joi.string().required(),
    }).validate(req.body, { allowUnknown: true }));
    params.userData = await userService.checkLogin({ req });
    const addRes = await surveyService.add(params);
    return {
      code: 200,
      data: {
        id: addRes.pageId,
      },
    };
  }

  @SurveyServer({ type: 'http', method: 'post', routerName: '/create' })
  async create({ req }) {
    const params = getValidateValue(Joi.object({
      remark: Joi.string().required(),
      questionType: Joi.string().allow(null),
      title: Joi.string().required(),
      createMethod: Joi.string().allow(null),
      createFrom: Joi.string().allow(null),
    }).validate(req.body, { allowUnknown: true }));
    params.userData = await userService.checkLogin({ req });
    const addRes = await surveyService.create(params);
    return {
      code: 200,
      data: {
        id: addRes.pageId,
      },
    };
  }

  @SurveyServer({ type: 'http', method: 'post', routerName: '/update' })
  async update({ req }) {
    const surveyParams = getValidateValue(Joi.object({
      surveyId: Joi.string().required(),
      remark: Joi.string().required(),
      title: Joi.string().required(),
    }).validate(req.body, { allowUnknown: true }));
    const userData = await userService.checkLogin({ req });
    surveyParams.userData = userData;
    const data = await surveyService.update(surveyParams);
    return {
      code: 200,
      data,
    };
  }

  @SurveyServer({ type: 'http', method: 'post', routerName: '/delete' })
  async delete({ req }) {
    const surveyParams = getValidateValue(Joi.object({
      surveyId: Joi.string().required(),
    }).validate(req.body, { allowUnknown: true }));
    const userData = await userService.checkLogin({ req });
    surveyParams.userData = userData;
    const data = await surveyService.delete(surveyParams);
    return {
      code: 200,
      data,
    };
  }
  @SurveyServer({ type: 'http', method: 'get', routerName: '/list' })
  async list({ req }) {
    const condition = getValidateValue(Joi.object({
      curPage: Joi.number().default(1),
      pageSize: Joi.number().default(10),
    }).validate(req.query, { allowUnknown: true }));
    const userData = await userService.checkLogin({ req });
    const listRes = await surveyService.list({
      pageNum: condition.curPage,
      pageSize: condition.pageSize,
      userData
    });
    return {
      code: 200,
      data: listRes,
    };
  }
  @SurveyServer({ type: 'http', method: 'post', routerName: '/saveConf' })
  async saveConf({ req }) {
    const surveyData = getValidateValue(Joi.object({
      surveyId: Joi.string().required(),
      configData: Joi.object().required(),
    }).validate(req.body, { allowUnknown: true }));
    const userData = await userService.checkLogin({ req });
    // 保存数据
    const saveRes = await surveyService.saveConf(surveyData);
    // 保存历史
    const historyRes = await surveyHistoryService.addHistory({
      surveyId: surveyData.surveyId,
      configData: surveyData.configData,
      type: HISTORY_TYPE.dailyHis,
      userData
    });
    return {
      code: 200,
      data: {
        saveRes,
        historyRes
      }
    };
  }

  @SurveyServer({ type: 'http', method: 'get', routerName: '/get' })
  async get({ req }) {
    const params = getValidateValue(Joi.object({
      surveyId: Joi.string().required(),
    }).validate(req.query, { allowUnknown: true }));
    const userData = await userService.checkLogin({ req });
    const data = await surveyService.get({
      surveyId: params.surveyId,
      userData
    });
    return {
      code: 200,
      data,
    };
  }

  @SurveyServer({ type: 'http', method: 'get', routerName: '/getHistoryList' })
  async getHistoryList({ req }) {
    const historyParams = getValidateValue(Joi.object({
      surveyId: Joi.string().required(),
      historyType: Joi.string().required(),
    }).validate(req.query, { allowUnknown: true }));
    const data = await surveyHistoryService.getHistoryList(historyParams);
    return {
      code: 200,
      data
    };
  }

  @SurveyServer({ type: 'http', method: 'post', routerName: '/publish' })
  async publish({ req }) {
    const surveyParams = getValidateValue(Joi.object({
      surveyId: Joi.string().required(),
    }).validate(req.body, { allowUnknown: true }));
    // 鉴权
    const userData = await userService.checkLogin({ req });
    // 发布
    surveyParams.userData = userData;
    const surveyData = await surveyService.publish(surveyParams);
    // 保存历史
    const historyRes = await surveyHistoryService.addHistory({
      surveyId: surveyData.surveyConfRes.pageId,
      configData: surveyData.surveyConfRes.code,
      type: HISTORY_TYPE.publishHis,
      userData
    });
    return {
      code: 200,
      data: {
        ...surveyData,
        historyRes
      }
    };
  }

  @SurveyServer({ type: 'http', method: 'get', routerName: '/data' })
  async data({ req }) {
    const surveyParams = getValidateValue(Joi.object({
      surveyId: Joi.string().required(),
      isShowSecret: Joi.boolean().default(true), // 默认true就是需要脱敏
      page: Joi.number().default(1),
      pageSize: Joi.number().default(10),
    }).validate(req.query, { allowUnknown: true }));
    const userData = await userService.checkLogin({ req });
    const data = await surveyService.data({
      userData,
      surveyId: surveyParams.surveyId,
      isShowSecret: surveyParams.isShowSecret,
      pageNum: surveyParams.page,
      pageSize: surveyParams.pageSize,
    });
    return {
      code: 200,
      data
    };
  }
}