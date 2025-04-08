import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  Query,
  SetMetadata,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import moment from 'moment';

import { Authentication } from 'src/guards/authentication.guard';
import { OpenAuthGuard } from 'src/guards/openAuth.guard';

import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';

import { UserService } from 'src/modules/auth/services/user.service';
import { Logger } from 'src/logger';
import { ChannelService } from '../services/channel.service';
import { SurveyResponseService } from 'src/modules/surveyResponse/services/surveyResponse.service';
import { SurveyConfService } from 'src/modules/survey/services/surveyConf.service';
import { SurveyMetaService } from 'src/modules/survey/services/surveyMeta.service';
import { CreateChannelDto } from '../dto/createChannel.dto';
import { GetChannelListDto } from '../dto/getChannelList.dto';
import { FindChannelDto } from '../dto/findChannel.dto';

import { Channel } from 'src/models/channel.entity';
import { CHANNEL_STATUS } from 'src/enums/channel'
import { SurveyGuard } from 'src/guards/survey.guard';
import { SURVEY_PERMISSION } from 'src/enums/surveyPermission';

@ApiTags('channel')
@Controller('/api/channel')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    private readonly userService: UserService,
    private readonly surveyResponseService: SurveyResponseService,
    private readonly surveyConfService: SurveyConfService,
    private readonly surveyMetaService: SurveyMetaService,
    private readonly logger: Logger,
  ) {}

  @Post('/create')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(Authentication, SurveyGuard)
  @SetMetadata('surveyId', 'body.surveyId')
  @SetMetadata('surveyPermission', [SURVEY_PERMISSION.SURVEY_CONF_MANAGE])
  async create(@Body() channel: CreateChannelDto, @Request() req) {
    const { value, error } = CreateChannelDto.validate(channel);
    if (error) {
      this.logger.error(`CreateChannelDto validate failed: ${error.message}`);
      throw new HttpException(
        `参数错误: 请联系管理员`,
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    }

    const userId = req.user._id.toString();
    // 插入渠道表
    const retChannel = await this.channelService.create({
      name: value.name,
      type: value.type,
      surveyId: value.surveyId,
      ownerId: userId,
    });
    const channelId = retChannel._id.toString();
   
    return {
      code: 200,
      data: {
        channelId,
      },
    };
  }

  @Get('/getList')
  @ApiBearerAuth()
  @UseGuards(Authentication, SurveyGuard)
  @SetMetadata('surveyId', 'query.surveyId')
  @SetMetadata('surveyPermission', [SURVEY_PERMISSION.SURVEY_CONF_MANAGE])
  @HttpCode(200)
  async findAll(@Request() req, @Query() queryInfo: GetChannelListDto) {
    const { value, error } = GetChannelListDto.validate(queryInfo);
    if (error) {
      this.logger.error(
        `GetChannelListDto validate failed: ${error.message}`,
      );
      throw new HttpException(
        `参数错误: 请联系管理员`,
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    }
    const userId = req.user._id.toString();
    const username = req.user.username;
    const curPage = Number(value.curPage);
    const pageSize = Number(value.pageSize);

    // 查询当前问卷的渠道列表
    const channelList = await this.channelService.findAllBySurveyId(queryInfo.surveyId);
    const idList = channelList.map((item) => item._id);
    // 遍历查询渠道的回收量
    const channelCountList = await Promise.all(
      idList.map((item) => {
        return this.surveyResponseService.getSurveyResponseTotalByChannel({
          channelId: item.toString(),
        });
      }),
    );

    const channelCountMap = idList.reduce((pre, cur: any, index) => {
      const count = channelCountList[index];
      pre[cur] = count;
      return pre;
    }, {});

    // 查询当前用户的空间列表
    const { list, count: total } =
      await this.channelService.findAllByIdWithPagination({
        idList,
        page: curPage,
        limit: pageSize,
        name: queryInfo.name,
      });
    return {
      code: 200,
      data: {
        list: list.map((item) => {
          const channelId = item._id.toString();
          return {
            ...item,
            createdAt: moment((item as any).createdAt).format('YYYY-MM-DD HH:mm:ss'),
            currentUserId: userId,
            currentUse: username,
            count: channelCountMap[channelId] || 0,
          };
        }),
        total,
      },
    };
  }

  @Post('/update')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(Authentication, SurveyGuard)
  @SetMetadata('surveyId', 'body.surveyId')
  @SetMetadata('surveyPermission', [SURVEY_PERMISSION.SURVEY_CONF_MANAGE])
  async update(
    @Body() channel: Partial<Channel>,
    @Request() req
  ) {
    const id = req.body.channelId;
    const operatorId = req.user._id.toString();
    const updateRes = await this.channelService.update({
      id,
      channel,
      operatorId,
    });
    this.logger.info(`updateRes: ${JSON.stringify(updateRes)}`);
    return {
      code: 200,
    };
  }

  @Get('/find')
  @HttpCode(200)
  @UseGuards(OpenAuthGuard)
  async find(
    @Request() req,
    @Query() queryInfo: FindChannelDto
  ) {
    try {
      const id = queryInfo.channelId;
      const updateRes = await this.channelService.findOneById(id);
      this.logger.info(`channelInfo: ${JSON.stringify(updateRes)}`);

      if(updateRes.status === CHANNEL_STATUS.RECYCLING) {
        const surveyId = updateRes.surveyId;
        const surveyMeta = 
          await this.surveyMetaService.getSurveyById({ surveyId });
        return {
          code: 200,
          data: {
             ...updateRes, surveyPath:surveyMeta.surveyPath,
          },
        };
      } else {
        return {
          code: 200,
          message: '渠道回收已关闭，无法访问'
        };
      }
    } catch(e){
      throw new HttpException(
        `渠道不存在`,
        EXCEPTION_CODE.SURVEY_NOT_FOUND,
      );
    }
  }

  @Post('/status')
  @ApiBearerAuth()
  @UseGuards(Authentication, SurveyGuard)
  @SetMetadata('surveyId', 'body.surveyId')
  @SetMetadata('surveyPermission', [SURVEY_PERMISSION.SURVEY_CONF_MANAGE])
  @HttpCode(200)
  async updateStatus(
    @Body() parama: Partial<{ status: CHANNEL_STATUS }>,
    @Request() req
  ) {
    const id = req.body.channelId;
    const operatorId = req.user._id.toString();
    const updateRes = await this.channelService.updateStatus({
      id,
      status: parama.status,
      operatorId,
    });
    this.logger.info(`updateRes: ${JSON.stringify(updateRes)}`);
    return {
      code: 200,
    };
  }


  @Post('/delete')
  @ApiBearerAuth()
  @UseGuards(Authentication, SurveyGuard)
  @SetMetadata('surveyId', 'body.surveyId')
  @SetMetadata('surveyPermission', [SURVEY_PERMISSION.SURVEY_CONF_MANAGE])
  @HttpCode(200)
  async delete(@Request() req) {
    const id = req.body.channelId;
    const operatorId = req.user._id.toString();
    const deleteRes = await this.channelService.delete(id, {operatorId});
    this.logger.info(`res: ${JSON.stringify(deleteRes)}`);
    return {
      code: 200,
    };
  }
}
