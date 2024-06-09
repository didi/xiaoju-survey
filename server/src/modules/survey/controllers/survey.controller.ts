import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';

import { SurveyMetaService } from '../services/surveyMeta.service';
import { SurveyConfService } from '../services/surveyConf.service';
import { ResponseSchemaService } from '../../surveyResponse/services/responseScheme.service';
import { ContentSecurityService } from '../services/contentSecurity.service';
import { SurveyHistoryService } from '../services/surveyHistory.service';
import { CounterService } from 'src/modules/surveyResponse/services/counter.service';

import BannerData from '../template/banner/index.json';

import * as Joi from 'joi';
import { ApiTags } from '@nestjs/swagger';
import { Authtication } from 'src/guards/authtication';
import { HISTORY_TYPE } from 'src/enums';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { Logger } from 'src/logger';

@ApiTags('survey')
@Controller('/api/survey')
export class SurveyController {
  constructor(
    private readonly surveyMetaService: SurveyMetaService,
    private readonly surveyConfService: SurveyConfService,
    private readonly responseSchemaService: ResponseSchemaService,
    private readonly contentSecurityService: ContentSecurityService,
    private readonly surveyHistoryService: SurveyHistoryService,
    private readonly logger: Logger,
    private readonly counterService: CounterService
  ) {}

  @Get('/getBannerData')
  @HttpCode(200)
  async getBannerData() {
    return {
      code: 200,
      data: BannerData,
    };
  }

  @UseGuards(Authtication)
  @Post('/createSurvey')
  @HttpCode(200)
  async createSurvey(
    @Body()
    reqBody,
    @Request()
    req,
  ) {
    let validationResult;
    try {
      validationResult = await Joi.object({
        title: Joi.string().required(),
        remark: Joi.string().allow(null, '').default(''),
        surveyType: Joi.string().when('createMethod', {
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
      }).validateAsync(reqBody);
    } catch (error) {
      this.logger.error(`createSurvey_parameter error: ${error.message}`, {
        req,
      });
      throw new HttpException('参数错误', EXCEPTION_CODE.PARAMETER_ERROR);
    }

    const { title, remark, createMethod, createFrom } = validationResult;

    const username = req.user.username;
    let surveyType = '';
    if (createMethod === 'copy') {
      const survey = await this.surveyMetaService.checkSurveyAccess({
        surveyId: createFrom,
        username,
      });
      surveyType = survey.surveyType;
    } else {
      surveyType = validationResult.surveyType;
    }

    const surveyMeta = await this.surveyMetaService.createSurveyMeta({
      title,
      remark,
      surveyType,
      username,
      createMethod,
      createFrom,
    });
    await this.surveyConfService.createSurveyConf({
      surveyId: surveyMeta._id.toString(),
      surveyType: surveyType,
      createMethod: validationResult.createMethod,
      createFrom: validationResult.createFrom,
    });
    return {
      code: 200,
      data: {
        id: surveyMeta._id.toString(),
      },
    };
  }

  @UseGuards(Authtication)
  @Post('/updateConf')
  @HttpCode(200)
  async updateConf(
    @Body()
    surveyInfo,
    @Request()
    req,
  ) {
    const validationResult = await Joi.object({
      surveyId: Joi.string().required(),
      configData: Joi.any().required(),
    }).validateAsync(surveyInfo);
    const username = req.user.username;
    const surveyId = validationResult.surveyId;
    await this.surveyMetaService.checkSurveyAccess({
      surveyId,
      username,
    });
    const configData = validationResult.configData;
    await this.surveyConfService.saveSurveyConf({
      surveyId,
      schema: configData,
    });
    await this.surveyHistoryService.addHistory({
      surveyId,
      schema: configData,
      type: HISTORY_TYPE.DAILY_HIS,
      user: {
        _id: req.user._id.toString(),
        username,
      },
    });
    return {
      code: 200,
    };
  }

  @UseGuards(Authtication)
  @HttpCode(200)
  @Post('/deleteSurvey')
  async deleteSurvey(@Body() reqBody, @Request() req) {
    const validationResult = await Joi.object({
      surveyId: Joi.string().required(),
    }).validateAsync(reqBody, { allowUnknown: true });
    const username = req.user.username;
    const surveyId = validationResult.surveyId;
    const survey = await this.surveyMetaService.checkSurveyAccess({
      surveyId,
      username,
    });

    await this.surveyMetaService.deleteSurveyMeta(survey);
    await this.responseSchemaService.deleteResponseSchema({
      surveyPath: survey.surveyPath,
    });

    return {
      code: 200,
    };
  }

  @UseGuards(Authtication)
  @Get('/getSurvey')
  @HttpCode(200)
  async getSurvey(
    @Query()
    queryInfo: {
      surveyId: string;
    },
    @Request()
    req,
  ) {
    const validationResult = await Joi.object({
      surveyId: Joi.string().required(),
    }).validateAsync(queryInfo);

    const username = req.user.username;
    const surveyId = validationResult.surveyId;
    const surveyMeta = await this.surveyMetaService.checkSurveyAccess({
      surveyId,
      username,
    });
    const surveyConf =
      await this.surveyConfService.getSurveyConfBySurveyId(surveyId);

    return {
      code: 200,
      data: {
        surveyMetaRes: surveyMeta,
        surveyConfRes: surveyConf,
      },
    };
  }

  @UseGuards(Authtication)
  @Post('/publishSurvey')
  @HttpCode(200)
  async publishSurvey(
    @Body()
    surveyInfo,
    @Request()
    req,
  ) {
    const validationResult = await Joi.object({
      surveyId: Joi.string().required(),
    }).validateAsync(surveyInfo);
    const username = req.user.username;
    const surveyId = validationResult.surveyId;
    const surveyMeta = await this.surveyMetaService.checkSurveyAccess({
      surveyId,
      username,
    });
    const surveyConf =
      await this.surveyConfService.getSurveyConfBySurveyId(surveyId);

    const { text } = await this.surveyConfService.getSurveyContentByCode(
      surveyConf.code,
    );

    if (await this.contentSecurityService.isForbiddenContent({ text })) {
      throw new HttpException(
        '问卷存在非法关键字，不允许发布',
        EXCEPTION_CODE.SURVEY_CONTENT_NOT_ALLOW,
      );
    }

    await this.surveyMetaService.publishSurveyMeta({
      surveyMeta,
    });

    await this.responseSchemaService.publishResponseSchema({
      title: surveyMeta.title,
      surveyPath: surveyMeta.surveyPath,
      code: surveyConf.code,
      pageId: surveyId,
    });

    await this.counterService.createCounters({
      surveyPath: surveyMeta.surveyPath,
      dataList: surveyConf.code.dataConf.dataList
    })
    
    await this.surveyHistoryService.addHistory({
      surveyId,
      schema: surveyConf.code,
      type: HISTORY_TYPE.PUBLISH_HIS,
      user: {
        _id: req.user._id.toString(),
        username,
      },
    });
    return {
      code: 200,
    };
  }
}
