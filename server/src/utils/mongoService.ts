import { Collection, MongoClient, ObjectId } from 'mongodb';
import { CommonError } from '../types';


// 定义一个通用类型，表示具有 _id 字段的对象
interface ObjectWithId {
  _id: ObjectId;
  // 其他可能的属性...
}

class MongoService {
  isInit: boolean;
  client: MongoClient;
  dbName: string;
  constructor({ url, dbName }) {
    this.client = new MongoClient(url);
    this.dbName = dbName;
  }

  async getCollection({ collectionName }): Promise<Collection> {
    try {
      // 设置一个6秒的计时器
      const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('连接超时'));
        }, 6000); // 6秒超时
      });
      await Promise.race([this.client.connect(), timeoutPromise]);
    } catch (error) {
      throw new CommonError('数据库连接错误：' + error.message);
    }

    try {
      return this.client.db(this.dbName).collection(collectionName);
    } catch (error) {
      throw new CommonError(`get collection ${collectionName} error`);
    }
  }

  convertId2StringByDoc<T extends ObjectWithId>(doc: T): T {
    return { ...doc, _id: doc._id.toString() };
  }

  convertId2StringByList<T extends ObjectWithId>(list: Array<T>): Array<T> {
    return list.map(e => {
      return this.convertId2StringByDoc(e);
    });
  }

  getObjectIdByStr(str: string) {
    return new ObjectId(str);
  }
}

export default MongoService;