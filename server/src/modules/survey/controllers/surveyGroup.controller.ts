import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import moment from 'moment';
import { Authentication } from 'src/guards/authentication.guard';
import { SurveyMetaService } from 'src/modules/survey/services/surveyMeta.service';
import { SurveyGroupService } from '../services/surveyGroup.service';

import { Logger } from 'src/logger';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';

import { CreateSurveyGroupDto } from '../dto/createSurveyGroup.dto';
import { UpdateSurveyGroupDto } from '../dto/updateSurveyGroup.dto';
import { GetGroupListDto } from '../dto/getGroupList.dto';
import { CollaboratorService } from '../services/collaborator.service';

@ApiTags('surveyGroup')
@ApiBearerAuth()
@UseGuards(Authentication)
@Controller('/api/surveyGroup')
export class SurveyGroupController {
  constructor(
    private readonly surveyMetaService: SurveyMetaService,
    private readonly surveyGroupService: SurveyGroupService,
    private readonly logger: Logger,
    private readonly collaboratorService: CollaboratorService,
  ) {}
  @Post()
  @HttpCode(200)
  async create(
    @Body()
    reqBody: CreateSurveyGroupDto,
    @Request()
    req,
  ) {
    const { error, value } = CreateSurveyGroupDto.validate(reqBody);
    if (error) {
      this.logger.error(`createSurveyGroup_parameter error: ${error.message}`);
      throw new HttpException('参数错误', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    const userId = req.user._id.toString();
    const ret = await this.surveyGroupService.create({
      name: value.name,
      ownerId: userId,
    });
    return {
      code: 200,
      data: {
        id: ret._id,
      },
    };
  }

  @Get()
  @HttpCode(200)
  async findAll(@Request() req, @Query() queryInfo: GetGroupListDto) {
    const { value, error } = GetGroupListDto.validate(queryInfo);
    if (error) {
      this.logger.error(`GetGroupListDto validate failed: ${error.message}`);
      throw new HttpException(
        `参数错误: 请联系管理员`,
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    }
    const userId = req.user._id.toString();
    const curPage = Number(value.curPage);
    const pageSize = Number(value.pageSize);
    const skip = (curPage - 1) * pageSize;
    const { total, list, allList } = await this.surveyGroupService.findAll(
      userId,
      value.name,
      skip,
      pageSize,
    );
    const groupIdList = list.map((item) => item._id.toString());
    const surveyTotalList = await Promise.all(
      groupIdList.map((item) => {
        return this.surveyMetaService.countSurveyMetaByGroupId({
          userId,
          groupId: item,
        });
      }),
    );
    const surveyTotalMap = groupIdList.reduce((pre, cur, index) => {
      const total = surveyTotalList[index];
      pre[cur] = total;
      return pre;
    }, {});
    const unclassifiedSurveyTotal =
      await this.surveyMetaService.countSurveyMetaByGroupId({
        userId,
        groupId: null,
      });
    const cooperationList =
      await this.collaboratorService.getCollaboratorListByUserId({ userId });
    const surveyIdList = cooperationList.map((item) => item.surveyId);
    const allSurveyTotal =
      await this.surveyMetaService.countSurveyMetaByGroupId({
        userId,
        surveyIdList,
        groupId: 'all',
      });
    return {
      code: 200,
      data: {
        total,
        list: list.map((item) => {
          const id = item._id.toString();
          return {
            ...item,
            createdAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
            surveyTotal: surveyTotalMap[id] || 0,
          };
        }),
        allList,
        unclassifiedSurveyTotal,
        allSurveyTotal,
      },
    };
  }

  @Post('/update')
  @HttpCode(200)
  async updateOne(
    @Body()
    reqBody: UpdateSurveyGroupDto,
    @Request()
    req,
  ) {
    const { error, value } = UpdateSurveyGroupDto.validate(reqBody);
    if (error) {
      this.logger.error(`createSurveyGroup_parameter error: ${error.message}`);
      throw new HttpException('参数错误', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    const group = await this.surveyGroupService.findOne(value.groupId);
    if (group.ownerId !== req.user._id.toString()) {
      throw new HttpException('没有权限', EXCEPTION_CODE.NO_PERMISSION);
    }
    const ret = await this.surveyGroupService.update(value.group, {
      name: value.name,
    });
    return {
      code: 200,
      ret,
    };
  }

  @Post('delete')
  @HttpCode(200)
  async remove(
    @Request()
    req,
  ) {
    const groupId = req.body.groupId;
    if (!groupId) {
      this.logger.error(`deleteSurveyGroup_parameter error: ${groupId}`);
      throw new HttpException('参数错误', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    const group = await this.surveyGroupService.findOne(groupId);
    if (group.ownerId !== req.user._id.toString()) {
      throw new HttpException('没有权限', EXCEPTION_CODE.NO_PERMISSION);
    }
    await this.surveyGroupService.remove(groupId);
    return {
      code: 200,
    };
  }
}
