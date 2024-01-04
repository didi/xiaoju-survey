import { mongo } from '../db/mongo';
import { getStatusObject, randomCode } from '../utils/index';
import { SURVEY_STATUS, CommonError } from '../../../types/index';
import { surveyKeyStoreService } from './surveyKeyStoreService';
import { getConfig } from '../config/index';
import * as CryptoJS from 'crypto-js';
import * as aes from 'crypto-js/aes';
import * as moment from 'moment';
import { keyBy } from 'lodash';
import { rpcInvote } from '../../../rpc';

const config = getConfig();

class SurveySubmitService {

  async addSessionData(data) {
    const surveySession = await mongo.getCollection({ collectionName: 'surveySession' });
    const surveySessionRes = await surveySession.insertOne({
      data,
      expireDate: Date.now() + config.session.expireTime
    });
    return {
      sessionId: surveySessionRes.insertedId.toString(),
      ...data
    };
  }

  async getSessionData(sessionId) {
    const surveySession = await mongo.getCollection({ collectionName: 'surveySession' });
    const sessionObjectId = mongo.getObjectIdByStr(sessionId);
    const surveySessionRes = await surveySession.findOne({ _id: sessionObjectId });
    await surveySession.deleteMany({ expireDate: { $lt: Date.now() } });
    return { sessionId, data: surveySessionRes.data };
  }

  async getEncryptInfo() {
    const encryptType = config.encrypt.type;
    let data = {};
    if (encryptType === 'aes') {
      data = await this.addSessionData({
        code: randomCode(config.encrypt.aesCodelength)
      });
    }
    return {
      encryptType,
      data
    };
  }

  async submit({ surveySubmitData }) {
    const surveyMeta = await mongo.getCollection({ collectionName: 'surveyMeta' });
    const surveyMetaRes = mongo.convertId2StringByDoc(
      await surveyMeta.findOne({ surveyPath: surveySubmitData.surveyPath })
    );
    if (!surveyMetaRes) {
      throw new CommonError('该问卷已不存在,无法提交');
    }
    const pageId = surveyMetaRes._id.toString();
    const surveyPublish = await mongo.getCollection({ collectionName: 'surveyPublish' });
    const publishConf = await surveyPublish.findOne({ pageId });
    const surveySubmit = await mongo.getCollection({ collectionName: 'surveySubmit' });
    if (surveySubmitData.encryptType === 'base64') {
      surveySubmitData.data = JSON.parse(decodeURIComponent(Buffer.from(surveySubmitData.data, 'base64').toString()));
    } else if (surveySubmitData.encryptType === 'aes') {
      const sessionData = await this.getSessionData(surveySubmitData.sessionId);
      surveySubmitData.data = JSON.parse(decodeURIComponent(aes.decrypt(surveySubmitData.data, sessionData.data.code).toString(CryptoJS.enc.Utf8)));
    } else {
      surveySubmitData.data = JSON.parse(surveySubmitData.data);
    }
    // 提交时间限制
    const begTime = publishConf?.code?.baseConf?.begTime || 0;
    const endTime = publishConf?.code?.baseConf?.endTime || 0;
    if (begTime && endTime) {
      const nowStamp = Date.now();
      const begTimeStamp = new Date(begTime).getTime();
      const endTimeStamp = new Date(endTime).getTime();
      if (nowStamp < begTimeStamp || nowStamp > endTimeStamp) {
        throw new CommonError('不在答题有效期内');
      }
    }
    // 提交时间段限制
    const answerBegTime = publishConf?.code?.baseConf?.answerBegTime || '00:00:00';
    const answerEndTime = publishConf?.code?.baseConf?.answerEndTime || '23:59:59';
    if (answerBegTime && answerEndTime) {
      const nowStamp = Date.now();
      const ymdString = moment().format('YYYY-MM-DD');
      const answerBegTimeStamp = new Date(`${ymdString} ${answerBegTime}`).getTime();
      const answerEndTimeStamp = new Date(`${ymdString} ${answerEndTime}`).getTime();
      if (nowStamp < answerBegTimeStamp || nowStamp > answerEndTimeStamp) {
        throw new CommonError('不在答题时段内');
      }
    }
    // 提交总数限制
    const tLimit = publishConf?.code?.baseConf?.tLimit || 0;
    if (tLimit > 0) {
      // 提升性能可以使用redis
      const nowSubmitCount = await surveySubmit.countDocuments({ surveyPath: surveySubmitData.surveyPath }) || 0;
      if (nowSubmitCount >= tLimit) {
        throw new CommonError('超出提交总数限制');
      }
    }
    const dataList = publishConf?.code?.dataConf?.dataList || [];
    const dataListMap = keyBy(dataList, 'field');

    const surveySubmitDataKeys = Object.keys(surveySubmitData.data);

    const secretKeys = [];

    for (const field of surveySubmitDataKeys) {
      const configData = dataListMap[field];
      const value = surveySubmitData.data[field];
      const values = Array.isArray(value) ? value : [value];

      if (configData && /vote/.exec(configData.type)) {
        // 投票信息保存
        const voteData = (await surveyKeyStoreService.get({ surveyPath: surveySubmitData.surveyPath, key: field, type: 'vote' })) || { total: 0 };
        voteData.total++;
        for (const val of values) {
          if (!voteData[val]) {
            voteData[val] = 1;
          } else {
            voteData[val]++;
          }
        }
        await surveyKeyStoreService.set({ surveyPath: surveySubmitData.surveyPath, key: field, data: voteData, type: 'vote' });
      }
      // 检查敏感数据，对敏感数据进行加密存储
      let isSecret = false;
      for (const val of values) {
        if (rpcInvote('security.isDataSensitive', val)) {
          isSecret = true;
          break;
        }
      }
      if (isSecret) {
        secretKeys.push(field);
        surveySubmitData.data[field] = Array.isArray(value) ? value.map(item => rpcInvote('security.encryptData', item)) : rpcInvote('security.encryptData', value);
      }
      
    }

    surveySubmitData.secretKeys = secretKeys;

    // 提交问卷
    const surveySubmitRes = await surveySubmit.insertOne({
      ...surveySubmitData,
      pageId,
      curStatus: getStatusObject({ status: SURVEY_STATUS.new }),
      createDate: Date.now()
    });
    return surveySubmitRes;
  }
}

export const surveySubmitService = new SurveySubmitService();