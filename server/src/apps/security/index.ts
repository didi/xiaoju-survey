import { SurveyApp, SurveyServer } from '../../decorator';
import { securityService } from './service/securityService';
import { isString } from './utils';
import AesDataSecurityPlugin from './dataSecurityPlugins/aesPlugin/index';
import { load } from 'cheerio';
import { getConfig } from './config/index';

const config = getConfig();
const pluginInstance = new AesDataSecurityPlugin({ secretKey: config.aesEncrypt.key });

@SurveyApp('/api/security')
export default class Security {
  @SurveyServer({ type: 'rpc' })
  async isHitKeys({ params, context }) {
    const data = securityService.isHitKeys({
      content: params.content,
      dictType: params.dictType,
    });
    return {
      result: data,
      context, // 上下文主要是传递调用方信息使用，比如traceid
    };
  }

  @SurveyServer({ type: 'rpc' })
  isDataSensitive(data) {
    if (!isString(data)) {
      return data;
    }
    const $ = load(data);
    const text = $.text();
    return pluginInstance.isDataSensitive(text);
  }

  @SurveyServer({ type: 'rpc' })
  encryptData(data) {
    if (!isString(data)) {
      return data;
    }
    return pluginInstance.encryptData(data);
  }

  @SurveyServer({ type: 'rpc' })
  decryptData(data) {
    if (!isString(data)) {
      return data;
    }
    return pluginInstance.decryptData(data);
  }

  @SurveyServer({ type: 'rpc' })
  desensitiveData(data) {
    // 数据脱敏
    if (!isString(data)) {
      return '*';
    }
    const $ = load(data);
    const text = $.text();
    return pluginInstance.desensitiveData(text);
  }
}