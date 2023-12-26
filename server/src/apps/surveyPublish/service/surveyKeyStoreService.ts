import { mongo } from '../db/mongo';
import { KeyStore } from '../../../types/keyStore';
// 该服务用于模拟redis
class SurveyKeyStoreService {
  getKeyStoreResult(surveyKeyStoreData: Array<KeyStore>) {
    const surveyKeyStoreReult = {};
    for (const surveyKeyStoreItem of surveyKeyStoreData) {
      surveyKeyStoreReult[surveyKeyStoreItem.key] = surveyKeyStoreItem.data;
    }
    return surveyKeyStoreReult;
  }

  async set({ surveyPath, key, data, type }) {
    const surveyKeyStore = await mongo.getCollection({ collectionName: 'surveyKeyStore' });
    const setResult = await surveyKeyStore.updateOne({
      key,
      surveyPath,
      type
    }, {
      $set: {
        key,
        surveyPath,
        type,
        data,
        createDate: Date.now(),
        updateDate: Date.now(),
      }
    }, {
      upsert: true //如果不存在则插入
    });
    return setResult;
  }

  async get({ surveyPath, key, type }) {
    const surveyKeyStore = await mongo.getCollection({ collectionName: 'surveyKeyStore' });
    const surveyKeyStoreData = await surveyKeyStore.findOne({
      key,
      surveyPath,
      type
    });
    return surveyKeyStoreData?.data;
  }

  async getAll({ surveyPath, keyList, type }) {
    const surveyKeyStore = await mongo.getCollection({ collectionName: 'surveyKeyStore' });
    const res = await surveyKeyStore.find({
      key: { $in: keyList },
      surveyPath,
      type
    }).toArray();
    const surveyKeyStoreData : Array<KeyStore> = res.map(doc => {
      return {
        key: doc.key,
        surveyPath: doc.surveyPath,
        type: doc.type,
        data: doc.data,
        createDate: doc.createDate,
        updateDate: doc.updateDate,
      };
    });
    return this.getKeyStoreResult(surveyKeyStoreData);
  }

}

export const surveyKeyStoreService = new SurveyKeyStoreService();