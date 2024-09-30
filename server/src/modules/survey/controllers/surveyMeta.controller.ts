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
import moment from 'moment';
import { ApiTags } from '@nestjs/swagger';

import { SurveyMetaService } from '../services/surveyMeta.service';

import { getFilter, getOrder } from 'src/utils/surveyUtil';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { Authentication } from 'src/guards/authentication.guard';
import { Logger } from 'src/logger';
import { SurveyGuard } from 'src/guards/survey.guard';
import { SURVEY_PERMISSION } from 'src/enums/surveyPermission';
import { WorkspaceGuard } from 'src/guards/workspace.guard';
import { PERMISSION as WORKSPACE_PERMISSION } from 'src/enums/workspace';

import { GetSurveyListDto } from '../dto/getSurveyMetaList.dto';
import { CollaboratorService } from '../services/collaborator.service';

@ApiTags('survey')
@Controller('/api/survey')
export class SurveyMetaController {
  constructor(
    private readonly surveyMetaService: SurveyMetaService,
    private readonly logger: Logger,
    private readonly collaboratorService: CollaboratorService,
  ) {}

  @Post('/updateMeta')
  @HttpCode(200)
  @UseGuards(SurveyGuard)
  @SetMetadata('surveyId', 'body.surveyId')
  @SetMetadata('surveyPermission', [SURVEY_PERMISSION.SURVEY_CONF_MANAGE])
  @UseGuards(Authentication)
  async updateMeta(@Body() reqBody, @Request() req) {
    const { value, error } = Joi.object({
      title: Joi.string().required(),
      remark: Joi.string().allow(null, '').default(''),
      surveyId: Joi.string().required(),
    }).validate(reqBody, { allowUnknown: true });

    if (error) {
      this.logger.error(`updateMeta_parameter error: ${error.message}`);
      throw new HttpException('参数错误', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    const survey = req.surveyMeta;
    survey.title = value.title;
    survey.remark = value.remark;

    await this.surveyMetaService.editSurveyMeta({
      survey,
      operator: req.user.username,
      operatorId: req.user._id.toString(),
    });

    return {
      code: 200,
    };
  }

  @UseGuards(WorkspaceGuard)
  @SetMetadata('workspacePermissions', [WORKSPACE_PERMISSION.READ_SURVEY])
  @SetMetadata('workspaceId', { optional: true, key: 'query.workspaceId' })
  @UseGuards(Authentication)
  @Get('/getList')
  @HttpCode(200)
  async getList(
    @Query()
    queryInfo: GetSurveyListDto,
    @Request()
    req,
  ) {
    const { value, error } = GetSurveyListDto.validate(queryInfo);
    if (error) {
      this.logger.error(error.message);
      throw new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    const { curPage, pageSize, workspaceId } = value;
    let filter = {},
      order = {};
    if (value.filter) {
      try {
        filter = getFilter(JSON.parse(decodeURIComponent(value.filter)));
      } catch (error) {
        this.logger.error(error.message);
      }
    }
    if (value.order) {
      try {
        order = order = getOrder(JSON.parse(decodeURIComponent(value.order)));
      } catch (error) {
        this.logger.error(error.message);
      }
    }
    const userId = req.user._id.toString();
    const cooperationList =
      await this.collaboratorService.getCollaboratorListByUserId({ userId });
    const cooperSurveyIdMap = cooperationList.reduce((pre, cur) => {
      pre[cur.surveyId] = cur;
      return pre;
    }, {});
    const surveyIdList = cooperationList.map((item) => item.surveyId);
    const username = req.user.username;
    const data = await this.surveyMetaService.getSurveyMetaList({
      pageNum: curPage,
      pageSize: pageSize,
      userId,
      username,
      filter,
      order,
      workspaceId,
      surveyIdList,
    });
    return {
      code: 200,
      data: {
        count: data.count,
        data: data.data.map((item) => {
          const fmt = 'YYYY-MM-DD HH:mm:ss';
          if (!item.surveyType) {
            item.surveyType = item.questionType || 'normal';
          }
          item.createdAt = moment(item.createdAt).format(fmt);
          item.curStatus.date = moment(item.curStatus.date).format(fmt);
          item.subStatus.date = moment(item.subStatus.date).format(fmt);
          item.updatedAt = moment(item.updatedAt).format(fmt);
          const surveyId = item._id.toString();
          if (cooperSurveyIdMap[surveyId]) {
            item.isCollaborated = true;
            item.currentPermissions = cooperSurveyIdMap[surveyId].permissions;
          } else {
            item.isCollaborated = false;
            item.currentPermissions = [];
          }
          item.currentUserId = userId;
          return item;
        }),
      },
    };
  }
}
