import { SurveyApp, SurveyServer } from '../../decorator';
import { surveyService } from './service/surveyService';
import { userService } from './service/userService';
import { surveyHistoryService } from './service/surveyHistoryService';
import { CommonError, HISTORY_TYPE } from '../../types/index';
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
      title: Joi.string().required(),
      questionType: Joi.string().when('createMethod', {
        is: 'copy',
        then: Joi.allow(null),
        otherwise: Joi.required(),
      }),
      createMethod: Joi.string().allow(null).default('basic'),
      createFrom: Joi.string().when('createMethod', {
        is: 'copy',
        then: Joi.required(),
        otherwise: Joi.allow(null),
      }),
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
      filter: Joi.string().allow(null),
      order: Joi.string().allow(null),
    }).validate(req.query, { allowUnknown: true }));
    const { filter, order } = this.getFilterAndOrder({
      order: condition.order,
      filter: condition.filter,
    });
    const userData = await userService.checkLogin({ req });
    const listRes = await surveyService.list({
      pageNum: condition.curPage,
      pageSize: condition.pageSize,
      filter,
      order,
      userData
    });
    return {
      code: 200,
      data: listRes,
    };
  }

  private getFilterAndOrder({ order, filter }) {
    const listFilter = [],
      listOrder = [];
    const allowFilterField = ['title', 'surveyType', 'curStatus.status'];
    const allowOrderField = ['createDate', 'updateDate'];
    if (filter) {
      try {
        const filterList = JSON.parse(filter).filter((filterItem) =>
          allowFilterField.includes(filterItem.field),
        );
        listFilter.push(...filterList);
      } catch (error) {
        throw new CommonError('filter格式不对');
      }
    }
    if (order) {
      try {
        const orderList = JSON.parse(order).filter((orderItem) =>
          allowOrderField.includes(orderItem.field),
        );
        listOrder.push(...orderList);
      } catch (error) {
        throw new CommonError('sort格式不对');
      }
    }
    return {
      order: listOrder.reduce((pre, cur) => {
        pre[cur.field] = cur.value;
        return pre;
      }, {}),
      filter: listFilter.reduce((pre, cur) => {
        switch (cur.type) {
        case 'ne':
          pre[cur.field] = {
            $ne: cur.value,
          };
          break;
        case 'regex':
          pre[cur.field] = {
            $regex: cur.value,
          };
          break;
        default:
          pre[cur.field] = cur.value;
        }
        return pre;
      }, {}),
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