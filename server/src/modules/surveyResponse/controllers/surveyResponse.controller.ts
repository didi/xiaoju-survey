import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { HttpException } from 'src/exceptions/httpException';
import { SurveyNotFoundException } from 'src/exceptions/surveyNotFoundException';
import { checkSign } from 'src/utils/checkSign';
import { ENCRYPT_TYPE } from 'src/enums/encrypt';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { getPushingData } from 'src/utils/messagePushing';

import { ResponseSchemaService } from '../services/responseScheme.service';
import { SurveyResponseService } from '../services/surveyResponse.service';
import { ClientEncryptService } from '../services/clientEncrypt.service';
import { MessagePushingTaskService } from '../../message/services/messagePushingTask.service';

import moment from 'moment';
import * as Joi from 'joi';
import * as forge from 'node-forge';
import { ApiTags } from '@nestjs/swagger';
import { MutexService } from 'src/modules/mutex/services/mutexService.service';
import { CounterService } from '../services/counter.service';

@ApiTags('surveyResponse')
@Controller('/api/surveyResponse')
export class SurveyResponseController {
  constructor(
    private readonly responseSchemaService: ResponseSchemaService,
    private readonly surveyResponseService: SurveyResponseService,
    private readonly clientEncryptService: ClientEncryptService,
    private readonly messagePushingTaskService: MessagePushingTaskService,
    private readonly mutexService: MutexService,
    private readonly counterService: CounterService,
  ) {}

  @Post('/createResponse')
  @HttpCode(200)
  async createResponse(@Body() reqBody) {
    // 检查签名
    checkSign(reqBody);
    // 校验参数
    const validationResult = await Joi.object({
      surveyPath: Joi.string().required(),
      data: Joi.any().required(),
      encryptType: Joi.string(),
      sessionId: Joi.string(),
      clientTime: Joi.number().required(),
      difTime: Joi.number(),
    }).validateAsync(reqBody, { allowUnknown: true });

    const { surveyPath, encryptType, data, sessionId, clientTime, difTime } =
      validationResult;

    // 查询schema
    const responseSchema =
      await this.responseSchemaService.getResponseSchemaByPath(surveyPath);
    if (!responseSchema || responseSchema.curStatus.status === 'removed') {
      throw new SurveyNotFoundException('该问卷不存在,无法提交');
    }

    const now = Date.now();
    // 提交时间限制
    const begTime = responseSchema.code?.baseConf?.begTime || 0;
    const endTime = responseSchema?.code?.baseConf?.endTime || 0;
    if (begTime && endTime) {
      const begTimeStamp = new Date(begTime).getTime();
      const endTimeStamp = new Date(endTime).getTime();
      if (now < begTimeStamp || now > endTimeStamp) {
        throw new HttpException(
          '不在答题有效期内',
          EXCEPTION_CODE.RESPONSE_CURRENT_TIME_NOT_ALLOW,
        );
      }
    }

    // 提交时间段限制
    const answerBegTime =
      responseSchema?.code?.baseConf?.answerBegTime || '00:00:00';
    const answerEndTime =
      responseSchema?.code?.baseConf?.answerEndTime || '00:00:00';
    if (answerBegTime && answerEndTime && answerBegTime !== answerEndTime) {
      const ymdString = moment().format('YYYY-MM-DD');
      const answerBegTimeStamp = new Date(
        `${ymdString} ${answerBegTime}`,
      ).getTime();
      const answerEndTimeStamp = new Date(
        `${ymdString} ${answerEndTime}`,
      ).getTime();
      if (now < answerBegTimeStamp || now > answerEndTimeStamp) {
        throw new HttpException(
          '不在答题时段内',
          EXCEPTION_CODE.RESPONSE_CURRENT_TIME_NOT_ALLOW,
        );
      }
    }

    // 提交总数限制
    const tLimit = responseSchema?.code?.baseConf?.tLimit || 0;
    if (tLimit > 0) {
      const nowSubmitCount =
        (await this.surveyResponseService.getSurveyResponseTotalByPath(
          surveyPath,
        )) || 0;
      if (nowSubmitCount >= tLimit) {
        throw new HttpException(
          '超出提交总数限制',
          EXCEPTION_CODE.RESPONSE_OVER_LIMIT,
        );
      }
    }

    // 解密数据
    let decryptedData: Record<string, any> = {};
    if (encryptType === ENCRYPT_TYPE.RSA && Array.isArray(data)) {
      const sessionData =
        await this.clientEncryptService.getEncryptInfoById(sessionId);
      try {
        const privateKeyObject = forge.pki.privateKeyFromPem(
          sessionData.data.privateKey,
        );
        let concatStr = '';
        for (const item of data) {
          concatStr += privateKeyObject.decrypt(
            forge.util.decode64(item),
            'RSA-OAEP',
          );
        }

        decryptedData = JSON.parse(decodeURIComponent(concatStr));
      } catch (error) {
        throw new HttpException(
          '数据解密失败',
          EXCEPTION_CODE.RESPONSE_DATA_DECRYPT_ERROR,
        );
      }
    } else {
      decryptedData = JSON.parse(decodeURIComponent(data));
    }

    // 生成一个optionTextAndId字段，因为选项文本可能会改，该字段记录当前提交的文本
    const dataList = responseSchema.code.dataConf.dataList;
    const optionTextAndId = dataList
      .filter((questionItem) => {
        return (
          Array.isArray(questionItem.options) &&
          questionItem.options.length > 0 &&
          decryptedData[questionItem.field]
        );
      })
      .reduce((pre, cur) => {
        const arr = cur.options.map((optionItem) => ({
          hash: optionItem.hash,
          text: optionItem.text,
          quota: optionItem.quota
        }));
        pre[cur.field] = arr;
        return pre;
      }, {});
    
    //选项配额校验
    await this.mutexService.runLocked(async () => {
      for (const field in decryptedData) {
        const value = decryptedData[field];
        const values = Array.isArray(value) ? value : [value];
        if (field in optionTextAndId) {
          const optionCountData = await this.counterService.get({
              key: field,
              surveyPath,
              type: 'option'
          });

          //遍历选项hash值
          for (const val of values) {
            const option = optionTextAndId[field].find(opt => opt["hash"] === val);
            if (option["quota"] != 0 && option["quota"] <= optionCountData[val]) {
                const item = dataList.find(item => item["field"] === field);
                throw new HttpException(`${item['title']}中的${option['text']}所选人数已达到上限，请重新选择`, EXCEPTION_CODE.RESPONSE_OVER_LIMIT);
            }
          }
        }
      };

      for (const field in decryptedData) {
        const value = decryptedData[field];
        const values = Array.isArray(value) ? value : [value];
        if (field in optionTextAndId) {
          const optionCountData = await this.counterService.get({
              key: field,
              surveyPath,
              type: 'option'
          });
          for (const val of values) {
            optionCountData[val]++;
            this.counterService.set({
              key: field,
              surveyPath,
              type: 'option',
              data: optionCountData
            });
          }
          optionCountData['total']++;
        }
      };

    })


    // 入库
    const surveyResponse =
      await this.surveyResponseService.createSurveyResponse({
        surveyPath: validationResult.surveyPath,
        data: decryptedData,
        clientTime,
        difTime,
        surveyId: responseSchema.pageId,
        optionTextAndId,
      });

    const surveyId = responseSchema.pageId;
    const sendData = getPushingData({
      surveyResponse,
      questionList: responseSchema?.code?.dataConf?.dataList || [],
      surveyId,
      surveyPath: responseSchema.surveyPath,
    });

    // 异步执行推送任务
    this.messagePushingTaskService.runResponseDataPush({
      surveyId,
      sendData,
    });

    // 入库成功后，要把密钥删掉，防止被重复使用
    this.clientEncryptService.deleteEncryptInfo(sessionId);

    return {
      code: 200,
      msg: '提交成功',
    };
  }
}