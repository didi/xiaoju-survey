import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  UseGuards,
  Request,
  SetMetadata,
} from '@nestjs/common';
import * as Joi from 'joi';
import { ApiTags } from '@nestjs/swagger';

import { SurveyMetaService } from '../services/surveyMeta.service';
import { SurveyConfService } from '../services/surveyConf.service';
import { ResponseSchemaService } from '../../surveyResponse/services/responseScheme.service';
import { ContentSecurityService } from '../services/contentSecurity.service';
import { SurveyHistoryService } from '../services/surveyHistory.service';

import BannerData from '../template/banner/index.json';
import { CreateSurveyDto } from '../dto/createSurvey.dto';

import { Authentication } from 'src/guards/authentication.guard';
import { HISTORY_TYPE } from 'src/enums';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { Logger } from 'src/logger';
import { SurveyGuard } from 'src/guards/survey.guard';
import { SURVEY_PERMISSION } from 'src/enums/surveyPermission';

import { WorkspaceGuard } from 'src/guards/workspace.guard';
import { PERMISSION as WORKSPACE_PERMISSION } from 'src/enums/workspace';
import { MemberType, WhitelistType } from 'src/interfaces/survey';

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
  ) {}

  @Get('/getBannerData')
  @HttpCode(200)
  async getBannerData() {
    return {
      code: 200,
      data: BannerData,
    };
  }

  @Post('/createSurvey')
  @HttpCode(200)
  @UseGuards(SurveyGuard)
  @SetMetadata('surveyId', 'body.createFrom')
  @SetMetadata('surveyPermission', [SURVEY_PERMISSION.SURVEY_CONF_MANAGE])
  @UseGuards(WorkspaceGuard)
  @SetMetadata('workspacePermissions', [WORKSPACE_PERMISSION.READ_SURVEY])
  @SetMetadata('workspaceId', { key: 'body.workspaceId', optional: true })
  @UseGuards(Authentication)
  async createSurvey(
    @Body()
    reqBody: CreateSurveyDto,
    @Request()
    req,
  ) {
    const { error, value } = CreateSurveyDto.validate(reqBody);
    if (error) {
      this.logger.error(`createSurvey_parameter error: ${error.message}`, {
        req,
      });
      throw new HttpException('参数错误', EXCEPTION_CODE.PARAMETER_ERROR);
    }

    const { title, remark, createMethod, createFrom } = value;

    let surveyType = '',
      workspaceId = null;
    if (createMethod === 'copy') {
      const survey = req.surveyMeta;
      surveyType = survey.surveyType;
      workspaceId = survey.workspaceId;
    } else {
      surveyType = value.surveyType;
      workspaceId = value.workspaceId;
    }

    const surveyMeta = await this.surveyMetaService.createSurveyMeta({
      title,
      remark,
      surveyType,
      username: req.user.username,
      userId: req.user._id.toString(),
      createMethod,
      createFrom,
      workspaceId,
    });
    await this.surveyConfService.createSurveyConf({
      surveyId: surveyMeta._id.toString(),
      surveyType: surveyType,
      createMethod: value.createMethod,
      createFrom: value.createFrom,
    });
    return {
      code: 200,
      data: {
        id: surveyMeta._id.toString(),
      },
    };
  }

  @Post('/updateConf')
  @HttpCode(200)
  @UseGuards(SurveyGuard)
  @SetMetadata('surveyId', 'body.surveyId')
  @SetMetadata('surveyPermission', [SURVEY_PERMISSION.SURVEY_CONF_MANAGE])
  @UseGuards(Authentication)
  async updateConf(
    @Body()
    surveyInfo,
    @Request()
    req,
  ) {
    const { value, error } = Joi.object({
      surveyId: Joi.string().required(),
      configData: Joi.any().required(),
    }).validate(surveyInfo);
    if (error) {
      this.logger.error(error.message, { req });
      throw new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    const username = req.user.username;
    const surveyId = value.surveyId;

    const configData = value.configData;
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

  @HttpCode(200)
  @Post('/deleteSurvey')
  @UseGuards(SurveyGuard)
  @SetMetadata('surveyId', 'body.surveyId')
  @SetMetadata('surveyPermission', [SURVEY_PERMISSION.SURVEY_CONF_MANAGE])
  @UseGuards(Authentication)
  async deleteSurvey(@Request() req) {
    const surveyMeta = req.surveyMeta;

    await this.surveyMetaService.deleteSurveyMeta(surveyMeta);
    await this.responseSchemaService.deleteResponseSchema({
      surveyPath: surveyMeta.surveyPath,
    });

    return {
      code: 200,
    };
  }

  @Get('/getSurvey')
  @HttpCode(200)
  @UseGuards(SurveyGuard)
  @SetMetadata('surveyId', 'query.surveyId')
  @SetMetadata('surveyPermission', [
    SURVEY_PERMISSION.SURVEY_CONF_MANAGE,
    SURVEY_PERMISSION.SURVEY_COOPERATION_MANAGE,
    SURVEY_PERMISSION.SURVEY_RESPONSE_MANAGE,
  ])
  @UseGuards(Authentication)
  async getSurvey(
    @Query()
    queryInfo: {
      surveyId: string;
    },
    @Request()
    req,
  ) {
    const { value, error } = Joi.object({
      surveyId: Joi.string().required(),
    }).validate(queryInfo);

    if (error) {
      this.logger.error(error.message, { req });
      throw new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR);
    }

    const surveyId = value.surveyId;
    const surveyMeta = req.surveyMeta;
    const surveyConf =
      await this.surveyConfService.getSurveyConfBySurveyId(surveyId);

    surveyMeta.currentUserId = req.user._id.toString();
    if (req.collaborator) {
      surveyMeta.isCollaborated = true;
      surveyMeta.currentPermission = req.collaborator.permissions;
    } else {
      surveyMeta.isCollaborated = false;
    }

    // 白名单相关字段的默认值
    const baseConf = surveyConf.code?.baseConf;
    if (baseConf) {
      baseConf.passwordSwitch = baseConf.passwordSwitch ?? false;
      baseConf.password = baseConf.password ?? '';
      baseConf.whitelistType = baseConf.whitelistType ?? WhitelistType.ALL;
      baseConf.whitelist = baseConf.whitelist ?? [];
      baseConf.memberType = baseConf.memberType ?? MemberType.MOBILE;
    }

    return {
      code: 200,
      data: {
        surveyMetaRes: surveyMeta,
        surveyConfRes: surveyConf,
      },
    };
  }

  @Get('/getPreviewSchema')
  @HttpCode(200)
  async getPreviewSchema(
    @Query()
    queryInfo: {
      surveyPath: string;
    },
    @Request()
    req,
  ) {
    const { value, error } = Joi.object({
      surveyId: Joi.string().required(),
    }).validate({ surveyId: queryInfo.surveyPath });

    if (error) {
      this.logger.error(error.message, { req });
      throw new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    const surveyId = value.surveyId;
    const surveyConf =
      await this.surveyConfService.getSurveyConfBySurveyId(surveyId);
    const surveyMeta = await this.surveyMetaService.getSurveyById({ surveyId });
    return {
      code: 200,
      data: {
        ...surveyConf,
        title: surveyMeta?.title,
        surveyPath: surveyMeta?.surveyPath,
      },
    };
  }

  @Post('/publishSurvey')
  @HttpCode(200)
  @UseGuards(SurveyGuard)
  @SetMetadata('surveyId', 'body.surveyId')
  @SetMetadata('surveyPermission', [SURVEY_PERMISSION.SURVEY_CONF_MANAGE])
  @UseGuards(Authentication)
  async publishSurvey(
    @Body()
    surveyInfo,
    @Request()
    req,
  ) {
    const { value, error } = Joi.object({
      surveyId: Joi.string().required(),
    }).validate(surveyInfo);
    if (error) {
      this.logger.error(error.message, { req });
      throw new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    const username = req.user.username;
    const surveyId = value.surveyId;
    const surveyMeta = req.surveyMeta;
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
