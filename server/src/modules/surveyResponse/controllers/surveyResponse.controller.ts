import { Controller, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import { HttpException } from 'src/exceptions/httpException';
import { SurveyNotFoundException } from 'src/exceptions/surveyNotFoundException';
import { checkSign } from 'src/utils/checkSign';
import { ENCRYPT_TYPE } from 'src/enums/encrypt';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { getPushingData } from 'src/utils/messagePushing';
import { RECORD_SUB_STATUS } from 'src/enums';

import { ResponseSchemaService } from '../services/responseScheme.service';
import { SurveyResponseService } from '../services/surveyResponse.service';
import { ClientEncryptService } from '../services/clientEncrypt.service';
import { MessagePushingTaskService } from '../../message/services/messagePushingTask.service';

import moment from 'moment';
import * as Joi from 'joi';
import * as forge from 'node-forge';
import { ApiTags } from '@nestjs/swagger';
import { pick } from 'lodash';

import { CounterService } from '../services/counter.service';
import { Logger } from 'src/logger';
import { WhitelistType } from 'src/interfaces/survey';
import { UserService } from 'src/modules/auth/services/user.service';
import { WorkspaceMemberService } from 'src/modules/workspace/services/workspaceMember.service';
import { QUESTION_TYPE } from 'src/enums/question';
import { OpenAuthGuard } from 'src/guards/openAuth.guard';

const optionQuestionType: Array<string> = [
  QUESTION_TYPE.RADIO,
  QUESTION_TYPE.CHECKBOX,
  QUESTION_TYPE.BINARY_CHOICE,
  QUESTION_TYPE.VOTE,
];

@ApiTags('surveyResponse')
@Controller('/api/surveyResponse')
export class SurveyResponseController {
  constructor(
    private readonly responseSchemaService: ResponseSchemaService,
    private readonly surveyResponseService: SurveyResponseService,
    private readonly clientEncryptService: ClientEncryptService,
    private readonly messagePushingTaskService: MessagePushingTaskService,
    private readonly counterService: CounterService,
    private readonly logger: Logger,
    private readonly userService: UserService,
    private readonly workspaceMemberService: WorkspaceMemberService,
  ) {}

  @Post('/createResponse')
  @HttpCode(200)
  async createResponse(@Body() reqBody) {
    const value = await this.validateParams(reqBody);
    const { encryptType, data, sessionId } = value;

    // 检查签名
    checkSign(reqBody);

    // 解密数据
    let result = data;
    let formValues: Record<string, any> = {};
    if (encryptType === ENCRYPT_TYPE.RSA && Array.isArray(data)) {
      result = await this.getDecryptedDataRSA(data, sessionId);
    }
    formValues = JSON.parse(JSON.stringify(result));
    try {
      await this.createResponseProcess({ ...value, data: formValues });
      return {
        code: 200,
        msg: '提交成功',
      };
    } catch (error) {
      this.logger.error(`createResponse error: ${error.message}`);
      throw error;
    }
  }
  @Post('/createResponseWithOpen')
  @UseGuards(OpenAuthGuard)
  @HttpCode(200)
  async createResponseWithOpen(@Body() reqBody) {
    if (!reqBody.channelId) {
      throw new HttpException('缺少渠道参数', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    const value = await this.validateParams(reqBody);
    const { data } = value;
    const channelId = reqBody.channelId;

    // 解密数据
    let formValues: Record<string, any> = {};

    formValues =
      typeof data === 'string'
        ? JSON.parse(data)
        : JSON.parse(JSON.stringify(data));
    try {
      await this.createResponseProcess(
        { ...value, data: formValues, channelId },
        false,
      );
      return {
        code: 200,
        msg: '提交成功',
      };
    } catch (error) {
      this.logger.error(`createResponse error: ${error.message}`);
      throw error;
    }
  }
  private async validateParams(reqBody) {
    // 校验参数
    const { value, error } = Joi.object({
      surveyPath: Joi.string().required(),
      data: Joi.any().required(),
      encryptType: Joi.string(),
      sessionId: Joi.string(),
      clientTime: Joi.number().required(),
      diffTime: Joi.number(),
      password: Joi.string().allow(null, ''),
      whitelist: Joi.string().allow(null, ''),
    }).validate(reqBody, { allowUnknown: true });

    if (error) {
      this.logger.error(`updateMeta_parameter error: ${error.message}`);
      throw new HttpException('参数错误', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    return value;
  }
  private async getDecryptedDataRSA(data, sessionId) {
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

      return JSON.parse(decodeURIComponent(concatStr));
    } catch (error) {
      throw new HttpException(
        '数据解密失败',
        EXCEPTION_CODE.RESPONSE_DATA_DECRYPT_ERROR,
      );
    }
  }
  async createResponseProcess(params, canPush = true) {
    const {
      surveyPath,
      sessionId,
      clientTime,
      diffTime,
      password,
      whitelist: whitelistValue,
      data: formValues,
    } = params;

    // 查询schema
    const responseSchema =
      await this.responseSchemaService.getResponseSchemaByPath(surveyPath);
    if (!responseSchema || responseSchema.isDeleted) {
      throw new SurveyNotFoundException('该问卷不存在,无法提交');
    }
    if (responseSchema?.subStatus?.status === RECORD_SUB_STATUS.PAUSING) {
      throw new HttpException(
        '该问卷已暂停，无法提交',
        EXCEPTION_CODE.RESPONSE_PAUSING,
      );
    }

    // 白名单的verifyId校验
    const baseConf = responseSchema.code.baseConf;

    // 密码校验
    if (baseConf?.passwordSwitch && baseConf.password) {
      if (baseConf.password !== password) {
        throw new HttpException(
          '白名单验证失败',
          EXCEPTION_CODE.WHITELIST_ERROR,
        );
      }
    }

    // 名单校验（手机号/邮箱）
    if (baseConf?.whitelistType === WhitelistType.CUSTOM) {
      if (!baseConf.whitelist.includes(whitelistValue)) {
        throw new HttpException(
          '白名单验证失败',
          EXCEPTION_CODE.WHITELIST_ERROR,
        );
      }
    }

    // 团队成员昵称校验
    if (baseConf?.whitelistType === WhitelistType.MEMBER) {
      const user = await this.userService.getUserByUsername(whitelistValue);
      if (!user) {
        throw new HttpException(
          '白名单验证失败',
          EXCEPTION_CODE.WHITELIST_ERROR,
        );
      }

      const workspaceMember = await this.workspaceMemberService.findAllByUserId(
        { userId: user._id.toString() },
      );
      if (!workspaceMember.length) {
        throw new HttpException(
          '白名单验证失败',
          EXCEPTION_CODE.WHITELIST_ERROR,
        );
      }
    }

    const now = Date.now();
    // 提交时间限制
    const beginTime = responseSchema.code?.baseConf?.beginTime || 0;
    const endTime = responseSchema?.code?.baseConf?.endTime || 0;
    if (beginTime && endTime) {
      const beginTimeStamp = new Date(beginTime).getTime();
      const endTimeStamp = new Date(endTime).getTime();
      if (now < beginTimeStamp || now > endTimeStamp) {
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

    // 生成一个optionTextAndId字段，因为选项文本可能会改，该字段记录当前提交的文本
    const dataList = responseSchema.code.dataConf.dataList;
    const optionTextAndId: Record<
      string,
      Array<{ hash: string; text: string }>
    > = {};
    const optionInfoWithId = dataList
      .filter((questionItem) => {
        return (
          optionQuestionType.includes(questionItem.type) &&
          Array.isArray(questionItem.options) &&
          questionItem.options.length > 0 &&
          formValues[questionItem.field]
        );
      })
      .reduce((pre, cur) => {
        const arr = cur.options.map((optionItem) => ({
          title: cur.title,
          hash: optionItem.hash,
          text: optionItem.text,
          quota: optionItem.quota ? Number(optionItem.quota) : 0,
        }));
        pre[cur.field] = arr;
        optionTextAndId[cur.field] = arr.map((item) =>
          pick(item, ['hash', 'text']),
        );
        return pre;
      }, {});

    await this.counterService.checkAndUpdateOptionCount({
      optionInfoWithId,
      userAnswer: formValues,
      surveyPath,
    });

    const surveyId = responseSchema.pageId;

    // 入库
    const model: any = {
      surveyPath: surveyPath,
      data: formValues,
      clientTime,
      diffTime,
      surveyId: responseSchema.pageId,
      optionTextAndId,
      channelId: params.channelId,
    };
    const surveyResponse =
      await this.surveyResponseService.createSurveyResponse(model);

    if (canPush) {
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
    }

    // 入库成功后，要把密钥删掉，防止被重复使用
    if (sessionId) {
      this.clientEncryptService.deleteEncryptInfo(sessionId);
    }
  }
}
