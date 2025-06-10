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
  Injectable,
} from '@nestjs/common';
import * as Joi from 'joi';
import moment from 'moment';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { SurveyMeta } from 'src/models/surveyMeta.entity';
import { ObjectId } from 'mongodb';

import { SurveyMetaService } from '../services/surveyMeta.service';
import { WorkspaceService } from '../../workspace/services/workspace.service';

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
import { GROUP_STATE } from 'src/enums/surveyGroup';

@ApiTags('survey')
@Controller('/api/survey')
export class SurveyMetaController {
  constructor(
    private readonly surveyMetaService: SurveyMetaService,
    private readonly logger: Logger,
    private readonly collaboratorService: CollaboratorService,
    private readonly workspaceService: WorkspaceService,
    @InjectRepository(SurveyMeta)
    private surveyMetaRepository: MongoRepository<SurveyMeta>,
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
      groupId: Joi.string().allow(null, ''),
    }).validate(reqBody, { allowUnknown: true });

    if (error) {
      this.logger.error(`updateMeta_parameter error: ${error.message}`);
      throw new HttpException('参数错误', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    const survey = req.surveyMeta;
    survey.title = value.title;
    survey.remark = value.remark;
    survey.groupId =
      value.groupId && value.groupId !== '' ? value.groupId : null;

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
    const { curPage, pageSize, workspaceId, groupId ,recycleId} = value;
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
    let cooperationList = [];
    let workspaceList = [];
    if (groupId === GROUP_STATE.ALL) {
      cooperationList =
        await this.collaboratorService.getCollaboratorListByUserId({ userId });
    }
    if (value.recycleId) {
      cooperationList =
        await this.collaboratorService.getCollaboratorListByUserId({ userId });
      const getWorkspaceListResult = 
        await this.workspaceService.getWorkspaceListByUserId(userId);
      workspaceList = getWorkspaceListResult.surveys;
    }
    const cooperSurveyIdMap = cooperationList.reduce((pre, cur) => {
      pre[cur.surveyId] = cur;
      return pre;
    }, {});
    const surveyIdList1 = cooperationList.map((item) => item.surveyId);
    const surveyIdList2 = workspaceList.map((item) => item._id.toString());
    const surveyIdList = [...surveyIdList1, ...surveyIdList2];
    const username = req.user.username;
    const data = await this.surveyMetaService.getSurveyMetaList({
      pageNum: curPage,
      pageSize: pageSize,
      userId,
      username,
      filter,
      order,
      workspaceId,
      groupId,
      surveyIdList,
      recycleId
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
          item.deletedAt = moment(item.deletedAt).format(fmt);
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
  
  @Get('/getRecycleTotal')
  @HttpCode(200)
  @UseGuards(Authentication)
  async getRecycleTotal(@Request() req) {
    const userId = req.user._id.toString();
    let cooperationList = [];
    let workspaceList = [];
    cooperationList =
      await this.collaboratorService.getCollaboratorListByUserId({ userId });
    const getWorkspaceListResult = 
      await this.workspaceService.getWorkspaceListByUserId(userId);
    workspaceList = getWorkspaceListResult.surveys;
    const surveyIdList1 = cooperationList.map((item) => item.surveyId);
    const surveyIdList2 = workspaceList.map((item) => item._id.toString());
    const surveyIdList = [...surveyIdList1, ...surveyIdList2]; 
    
    const surveys = await this.surveyMetaRepository.find({
      where: {
        _id: {
          $in: surveyIdList1.map(id => new ObjectId(id))
        },
        isDeleted: true,
        isCompletelyDeleted: { $ne: true }
      }
    });
    const surveytotal1 = surveys.length; // 直接获取数组长度
    
    const surveys2 = await this.surveyMetaRepository.find({
      where: {
        _id: {
          $in: surveyIdList2.map(id => new ObjectId(id))
        },
        isDeleted: true,
        isCompletelyDeleted: { $ne: true }
      }
    });
    const surveytotal2 = surveys2.length;
    const surveys3 = await this.surveyMetaRepository.find({
      where: {
        ownerId: userId,
        isDeleted: true,
        isCompletelyDeleted: { $ne: true },
        $and: [
          {
            workspaceId: { $exists: false },
          },
          {
            workspaceId: null,
          },
        ],
      }
    });
    const surveytotal3 = surveys3.length;
    return {
      code: 200,
      total: surveytotal1 + surveytotal2 + surveytotal3
    };
  }
}


