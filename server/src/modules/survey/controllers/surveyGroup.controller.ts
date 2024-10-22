import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
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

@ApiTags('surveyGroup')
@ApiBearerAuth()
@UseGuards(Authentication)
@Controller('api/surveyGroup')
export class SurveyGroupController {
  constructor(
    private readonly surveyMetaService: SurveyMetaService,
    private readonly SurveyGroupService: SurveyGroupService,
    private readonly logger: Logger,
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
    const ret = await this.SurveyGroupService.create({
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
    const { total, list, allList } = await this.SurveyGroupService.findAll(
      userId,
      value.name,
      skip,
      pageSize,
    );
    const groupIdList = list.map((item) => item._id.toString());
    const surveyTotalList = await Promise.all(
      groupIdList.map((item) => {
        return this.surveyMetaService.countSurveyMetaByGroupId({
          groupId: item,
        });
      }),
    );
    const surveyTotalMap = groupIdList.reduce((pre, cur, index) => {
      const total = surveyTotalList[index];
      pre[cur] = total;
      return pre;
    }, {});
    const notTotal = await this.surveyMetaService.countSurveyMetaByGroupId({
      groupId: null,
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
        notTotal,
      },
    };
  }

  @Post(':id')
  @HttpCode(200)
  async updateOne(
    @Param('id') id: string,
    @Body()
    reqBody: UpdateSurveyGroupDto,
  ) {
    const { error, value } = UpdateSurveyGroupDto.validate(reqBody);
    if (error) {
      this.logger.error(`createSurveyGroup_parameter error: ${error.message}`);
      throw new HttpException('参数错误', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    const ret = await this.SurveyGroupService.update(id, value);
    return {
      code: 200,
      ret,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string) {
    await this.SurveyGroupService.remove(id);
    return {
      code: 200,
    };
  }
}
