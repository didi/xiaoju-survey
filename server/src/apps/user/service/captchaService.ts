import { mongo } from '../db/mongo';
import { create } from 'svg-captcha';
class CaptchaService {

  createCaptcha() {
    return create({
      size: 4, // 验证码长度
      ignoreChars: '0o1i', // 忽略字符
      noise: 3, // 干扰线数量
      color: true, // 启用彩色
      background: '#f0f0f0', // 背景色
    });
  }

  async addCaptchaData({ text }) {
    const captchaDb = await mongo.getCollection({ collectionName: 'captcha' });
    const addRes = await captchaDb.insertOne({
      text,
    });
    return addRes;
  }

  async checkCaptchaIsCorrect({ captcha, id }) {
    const captchaDb = await mongo.getCollection({ collectionName: 'captcha' });
    const captchaData = await captchaDb.findOne({
      _id: mongo.getObjectIdByStr(id),
    });
    return captcha.toLowerCase() === captchaData?.text?.toLowerCase();
  }

  async deleteCaptcha({ id }) {
    const captchaDb = await mongo.getCollection({ collectionName: 'captcha' });
    const _id = mongo.getObjectIdByStr(id);
    await captchaDb.deleteOne({
      _id
    });
  }
}

export const captchaService = new CaptchaService();
<<<<<<< HEAD

=======
>>>>>>> d_feature/filter
