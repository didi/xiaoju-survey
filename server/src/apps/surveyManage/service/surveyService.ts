import { mongo } from '../db/mongo';
import { rpcInvote } from '../../../rpc';
import { SURVEY_STATUS, QUESTION_TYPE, CommonError, UserType, DICT_TYPE } from '../../../types/index';
import { getStatusObject, genSurveyPath } from '../utils/index';
import * as path from 'path';
import { keyBy, merge, cloneDeep } from 'lodash';
import * as moment from 'moment';
import { DataItem } from '../../../types/survey';
import { Sort } from 'mongodb';

class SurveyService {
  async checkSecurity({ content, dictType }: { content: string, dictType: DICT_TYPE }) {
    const rpcResult = await rpcInvote<unknown, { result: boolean }>('security.isHitKeys', {
      params: { content, dictType },
      context: {}
    });
    return rpcResult.result;
  }

  async getBannerData() {
    const bannerConfPath = path.resolve(__dirname, '../template/banner/index.json');
    return await import(bannerConfPath);
  }

  async getCodeData({
    questionType,
  }: { questionType: QUESTION_TYPE }): Promise<unknown> {
    const baseConfPath = path.resolve(__dirname, '../template/surveyTemplate/templateBase.json');
    const templateConfPath = path.resolve(
      __dirname,
      `../template/surveyTemplate/survey/${questionType}.json`,
    );

    const baseConf = cloneDeep(await import(baseConfPath));
    const templateConf = cloneDeep(await import(templateConfPath));
    const codeData = merge(baseConf, templateConf);
    const nowMoment = moment();
    codeData.baseConf.begTime = nowMoment.format('YYYY-MM-DD HH:mm:ss');
    codeData.baseConf.endTime = nowMoment.add(10, 'years').format('YYYY-MM-DD HH:mm:ss');
    return codeData;
  }
  async getNewSurveyPath() {
    const surveyMeta = await mongo.getCollection({ collectionName: 'surveyMeta' });
    const surveyPath = genSurveyPath();
    const surveyPathCount = await surveyMeta.countDocuments({ surveyPath });
    if (surveyPathCount > 0) { return await this.getNewSurveyPath(); }
    return surveyPath;
  }

  async add(surveyMetaInfo: { remark: string, questionType: QUESTION_TYPE, title: string, userData: UserType }) {
    const surveyMeta = await mongo.getCollection({ collectionName: 'surveyMeta' });
    const now = Date.now();
    const surveyPath = await this.getNewSurveyPath();
    const surveyMetaRes = await surveyMeta.insertOne({
      surveyPath,
      remark: surveyMetaInfo.remark,
      questionType: surveyMetaInfo.questionType,
      title: surveyMetaInfo.title,
      creator: surveyMetaInfo.userData.username,
      owner: surveyMetaInfo.userData.username,
      curStatus: getStatusObject({ status: SURVEY_STATUS.new }),
      createDate: now,
      updateDate: now,
    });
    const pageId = surveyMetaRes.insertedId.toString();
    const surveyConf = await mongo.getCollection({ collectionName: 'surveyConf' });
    const surveyConfRes = await surveyConf.insertOne({
      pageId,
      pageType: surveyMetaInfo.questionType,
      curStatus: getStatusObject({ status: SURVEY_STATUS.new }),
      code: await this.getCodeData({
        questionType: surveyMetaInfo.questionType,
      })
    });
    return {
      pageId,
      surveyMetaRes,
      surveyConfRes
    };
  }

  async create(surveyMetaInfo: { remark: string, questionType: QUESTION_TYPE, title: string, userData: UserType, createMethod: string; createFrom: string; }) {
    const surveyMeta = await mongo.getCollection({ collectionName: 'surveyMeta' });
    const now = Date.now();
    const surveyPath = await this.getNewSurveyPath();

    let originSurvey;
    if (surveyMetaInfo.createMethod === 'copy') {
      originSurvey = await this.get({ surveyId: surveyMetaInfo.createFrom, userData: surveyMetaInfo.userData });
      surveyMetaInfo.questionType = originSurvey.surveyMetaRes.questionType;
    }

    const surveyMetaRes = await surveyMeta.insertOne({
      surveyPath,
      remark: surveyMetaInfo.remark,
      questionType: surveyMetaInfo.questionType,
      createMethod: surveyMetaInfo.createMethod || 'basic',
      createFrom: surveyMetaInfo.createFrom || '',
      title: surveyMetaInfo.title,
      creator: surveyMetaInfo.userData.username,
      owner: surveyMetaInfo.userData.username,
      curStatus: getStatusObject({ status: SURVEY_STATUS.new }),
      createDate: now,
      updateDate: now,
    });
    const pageId = surveyMetaRes.insertedId.toString();
    const surveyConf = await mongo.getCollection({ collectionName: 'surveyConf' });
    const code = originSurvey ? originSurvey.surveyConfRes.code : await this.getCodeData({
      questionType: surveyMetaInfo.questionType,
    });
    const surveyConfRes = await surveyConf.insertOne({
      pageId,
      pageType: surveyMetaInfo.questionType,
      curStatus: getStatusObject({ status: SURVEY_STATUS.new }),
      code,
    });
    return {
      pageId,
      surveyMetaRes,
      surveyConfRes
    };
  }

  async update(surveyParams: { surveyId: string, remark: string, title: string, userData: UserType }) {
    const surveyMeta = await mongo.getCollection({ collectionName: 'surveyMeta' });
    const _id = mongo.getObjectIdByStr(surveyParams.surveyId);
    const surveyMetaUpdateRes = await surveyMeta.updateOne({
      _id,
      owner: surveyParams.userData.username,
    }, [{
      $set: {
        remark: surveyParams.remark,
        title: surveyParams.title,
        updateDate: Date.now(),
      }
    }, {
      $set: {
        'curStatus': {
          $cond: {
            if: {
              $eq: ['$curStatus.status', 'new']
            },
            then: '$curStatus',
            else: getStatusObject({ status: SURVEY_STATUS.editing })
          }
        }
      }
    }]);
    if (surveyMetaUpdateRes.matchedCount < 1) {
      throw new CommonError('更新问卷信息失败，问卷不存在或您不是该问卷所有者');
    }
    return {
      surveyMetaUpdateRes
    };
  }

  async delete(surveyParams: { surveyId: string, userData: UserType }) {
    const surveyMeta = await mongo.getCollection({ collectionName: 'surveyMeta' });
    const _id = mongo.getObjectIdByStr(surveyParams.surveyId);
    const surveyMetaDeleteRes = await surveyMeta.deleteOne({
      _id,
      owner: surveyParams.userData.username,
    });
    if (surveyMetaDeleteRes.deletedCount < 1) {
      throw new CommonError('删除问卷失败，问卷已被删除或您不是该问卷所有者');
    }
    return {
      surveyMetaDeleteRes
    };
  }

  async list(condition: { pageNum: number, pageSize: number, userData: UserType, filter: object, order: object }) {
    const surveyMeta = await mongo.getCollection({ collectionName: 'surveyMeta' });

    const query = Object.assign(
      {},
      {
        owner: condition.userData.username,
        'curStatus.status': {
          $ne: 'removed',
        },
      },
      condition.filter,
    );
    const order = Object.assign(
      {},
      {
        createDate: -1,
      },
      condition.order,
    ) as Sort;
    const data = await surveyMeta.find(query)
      .sort(order)
      .limit(condition.pageSize)
      .skip((condition.pageNum - 1) * condition.pageSize)
      .toArray();
    const count = await surveyMeta.countDocuments(query);
    return { data: mongo.convertId2StringByList(data), count };
  }

  getListHeadByDataList(dataList) {
    const listHead = dataList.map(surveyItem => {
      let othersCode;
      if (surveyItem.type === 'radio-star') {
        const rangeConfigKeys = Object.keys(surveyItem.rangeConfig);
        if (rangeConfigKeys.length > 0) {
          othersCode = [{ code: `${surveyItem.field}_custom`, option: '填写理由' }];
        }
      } else {
        othersCode = (surveyItem.options || [])
          .filter(optionItem => optionItem.othersKey)
          .map((optionItem) => {
            return {
              code: optionItem.othersKey,
              option: optionItem.text
            };
          });
      }
      return {
        field: surveyItem.field,
        title: surveyItem.title,
        type: surveyItem.type,
        othersCode
      };
    });
    listHead.push({
      field: 'difTime',
      title: '答题耗时（秒）',
      type: 'text',
    });
    listHead.push({
      field: 'createDate',
      title: '提交时间',
      type: 'text',
    });
    return listHead;
  }

  async data(condition: { userData: UserType, surveyId: string, pageNum: number, pageSize: number, isShowSecret: boolean }) {
    const surveyObjectId = mongo.getObjectIdByStr(condition.surveyId);
    const surveyMeta = await mongo.getCollection({ collectionName: 'surveyMeta' });
    const surveyMetaData = await surveyMeta.findOne({ _id: surveyObjectId });
    if (surveyMetaData.owner !== condition.userData.username) {
      throw new CommonError('问卷回收数据列表仅所有人才能打开');
    }
    const surveyPublish = await mongo.getCollection({ collectionName: 'surveyPublish' });
    const publishConf = await surveyPublish.findOne({ pageId: condition.surveyId });
    const dataList = publishConf?.code?.dataConf?.dataList || [];
    const listHead = this.getListHeadByDataList(dataList);
    const dataListMap = keyBy(dataList, 'field');
    const surveySubmit = await mongo.getCollection({ collectionName: 'surveySubmit' });
    const surveySubmitDataList = await surveySubmit.find({ pageId: condition.surveyId })
      .sort({ createDate: -1 })
      .limit(condition.pageSize)
      .skip((condition.pageNum - 1) * condition.pageSize)
      .toArray();

    const listBody = surveySubmitDataList.map(submitedData => {
      const data = submitedData.data;
      const secretKeys = submitedData.secretKeys;
      const dataKeys = Object.keys(data);

      for (const itemKey of dataKeys) {
        if (typeof itemKey !== 'string') { continue; }
        if (itemKey.indexOf('data') !== 0) { continue; }
        // 获取题目id
        const itemConfigKey = itemKey.split('_')[0];
        // 获取题目
        const itemConfig: DataItem = dataListMap[itemConfigKey];
        // 题目删除会出现，数据列表报错
        if (!itemConfig) { continue; }
        // 处理选项的更多输入框
        if (itemConfig.type === 'radio-star' && !data[`${itemConfigKey}_custom`]) {
          data[`${itemConfigKey}_custom`] = data[`${itemConfigKey}_${data[itemConfigKey]}`];
        }
        // 解密数据
        if (secretKeys.includes(itemKey)) {
          data[itemKey] = Array.isArray(data[itemKey]) ? data[itemKey].map(item => rpcInvote('security.decryptData', item)) : rpcInvote('security.decryptData', data[itemKey]);
        }
        // 将选项id还原成选项文案
        if (Array.isArray(itemConfig.options) && itemConfig.options.length > 0) {
          const optionTextMap = keyBy(itemConfig.options, 'hash');
          data[itemKey] = Array.isArray(data[itemKey]) ? data[itemKey].map(item => optionTextMap[item]?.text || item).join(',') : optionTextMap[data[itemKey]]?.text || data[itemKey];
        }
        // 数据脱敏
        if (condition.isShowSecret && rpcInvote('security.isDataSensitive', data[itemKey])) {
          data[itemKey] = rpcInvote('security.desensitiveData', data[itemKey]);
        }
      }
      return {
        ...data,
        difTime: (submitedData.difTime / 1000).toFixed(2),
        createDate: moment(submitedData.createDate).format('YYYY-MM-DD HH:mm:ss')
      };
    });
    const total = await surveySubmit.countDocuments({ pageId: condition.surveyId });
    return {
      total,
      listHead,
      listBody
    };
  }


  async get({ surveyId, userData }: { surveyId: string, userData: UserType }) {
    const surveyObjectId = mongo.getObjectIdByStr(surveyId);
    const surveyMeta = await mongo.getCollection({ collectionName: 'surveyMeta' });
    const surveyMetaData = await surveyMeta.findOne({ _id: surveyObjectId });
    if (!surveyMetaData) {
      throw new CommonError('问卷不存在或已被删除');
    }
    if (surveyMetaData.owner !== userData.username) {
      throw new CommonError('问卷仅所有人才能打开');
    }
    const surveyMetaRes = mongo.convertId2StringByDoc(surveyMetaData);
    const surveyConf = await mongo.getCollection({ collectionName: 'surveyConf' });
    const surveyConfData = await surveyConf.findOne({ pageId: surveyId });
    if (!surveyConfData) {
      throw new CommonError('问卷配置不存在或已被删除');
    }
    const surveyConfRes = mongo.convertId2StringByDoc(surveyConfData);
    return {
      surveyMetaRes,
      surveyConfRes
    };
  }


  async saveConf(surveyData: { surveyId: string, configData: unknown }) {
    const surveyConf = await mongo.getCollection({ collectionName: 'surveyConf' });
    const surveyMeta = await mongo.getCollection({ collectionName: 'surveyMeta' });
    const saveRes = await surveyConf.updateOne({
      pageId: surveyData.surveyId
    }, {
      $set: {
        code: surveyData.configData,
      }
    });
    const _id = mongo.getObjectIdByStr(surveyData.surveyId);
    surveyMeta.updateOne({
      _id,
    }, [{
      $set: {
        'curStatus': {
          $cond: {
            if: {
              $eq: ['$curStatus.status', 'new']
            },
            then: '$curStatus',
            else: getStatusObject({ status: SURVEY_STATUS.editing })
          }
        }
      }
    }]);
    return saveRes;
  }

  async publish({ surveyId, userData }: { surveyId: string, userData: UserType }) {
    const surveyObjectId = mongo.getObjectIdByStr(surveyId);
    const surveyMeta = await mongo.getCollection({ collectionName: 'surveyMeta' });
    const surveyConf = await mongo.getCollection({ collectionName: 'surveyConf' });
    const surveyMetaRes = await surveyMeta.findOne({ _id: surveyObjectId });
    if (!surveyMetaRes) {
      throw new CommonError('问卷不存在或已被删除,无法发布');
    }
    if (surveyMetaRes.owner !== userData.username) {
      throw new CommonError('只有问卷的所有者才能发布该问卷');
    }
    const surveyConfRes = await surveyConf.findOne({ pageId: surveyId });
    if (!surveyConfRes) {
      throw new CommonError('问卷配置不存在或已被删除,无法发布');
    }
    const surveyPublish = await mongo.getCollection({ collectionName: 'surveyPublish' });
    // 清除id存储发布
    delete surveyConfRes._id;
    surveyConfRes.title = surveyMetaRes.title;
    surveyConfRes.curStatus = surveyMetaRes.curStatus;
    surveyConfRes.surveyPath = surveyMetaRes.surveyPath;
    const dataList = surveyConfRes?.code?.dataConf?.dataList || [];
    for (const data of dataList) {
      const isDangerKey = await this.checkSecurity({ content: data.title, dictType: DICT_TYPE.danger });
      if (isDangerKey) {
        throw new CommonError('问卷存在非法关键字，不允许发布');
      }
      const isSecretKey = await this.checkSecurity({ content: data.title, dictType: DICT_TYPE.secret });
      if (isSecretKey) {
        data.isSecret = true;
      }
    }
    const publishRes = await surveyPublish.updateOne({
      pageId: surveyId
    }, {
      $set: surveyConfRes
    }, {
      upsert: true //如果不存在则插入
    });
    const updateMetaRes = await surveyMeta.updateOne({
      _id: surveyObjectId
    }, {
      $set: {
        curStatus: getStatusObject({ status: SURVEY_STATUS.published }),
      }
    });
    return {
      updateMetaRes,
      surveyConfRes,
      publishRes
    };
  }
}

export const surveyService = new SurveyService();