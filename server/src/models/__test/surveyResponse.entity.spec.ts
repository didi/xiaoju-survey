import { SurveyResponse } from '../surveyResponse.entity';
import pluginManager from 'src/securityPlugin/pluginManager';
import { ResponseSecurityPlugin } from 'src/securityPlugin/responseSecurityPlugin';
import { cloneDeep } from 'lodash';

const mockOriginData = {
  data405: '浙江省杭州市西湖区xxx',
  data450: '450111000000000000',
  data458: '15000000000',
  data515: '115019',
  data770: '123456@qq.com',
};

describe('SurveyResponse', () => {
  beforeEach(() => {
    pluginManager.registerPlugin(
      new ResponseSecurityPlugin('dataAesEncryptSecretKey'),
    );
  });

  it('should encrypt and decrypt success', async () => {
    const surveyResponse = new SurveyResponse();
    surveyResponse.data = cloneDeep(mockOriginData);
    await surveyResponse.onDataInsert();
    expect(surveyResponse.data.data405).not.toBe(mockOriginData.data405);
    expect(surveyResponse.data.data450).not.toBe(mockOriginData.data450);
    expect(surveyResponse.data.data458).not.toBe(mockOriginData.data458);
    expect(surveyResponse.data.data770).not.toBe(mockOriginData.data770);
    expect(surveyResponse.secretKeys).toEqual([
      'data405',
      'data450',
      'data458',
      'data770',
    ]);

    surveyResponse.onDataLoaded();
    expect(surveyResponse.data.data405).toBe(mockOriginData.data405);
    expect(surveyResponse.data.data450).toBe(mockOriginData.data450);
    expect(surveyResponse.data.data458).toBe(mockOriginData.data458);
    expect(surveyResponse.data.data770).toBe(mockOriginData.data770);
  });
});
