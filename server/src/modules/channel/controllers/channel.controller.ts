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


import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';

import { UserService } from 'src/modules/auth/services/user.service';
import { Logger } from 'src/logger';
import { ChannelService } from '../services/channel.service';
import { SurveyResponseService } from 'src/modules/surveyResponse/services/surveyResponse.service';
import { CreateChannelDto } from '../dto/createChannel.dto';
import { GetChannelListDto } from '../dto/getChannelList.dto';
import { Channel } from 'src/models/channel.entity';
import { DELIVER_STATUS } from 'src/enums/channel'

@ApiTags('channel')
@ApiBearerAuth()
@UseGuards(Authentication)
@Controller('/api/channel')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    private readonly userService: UserService,
    private readonly surveyResponseService: SurveyResponseService,
    private readonly logger: Logger,
  ) {}

  @Post()
  @HttpCode(200)
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
    const username = req.user.username;
    // 插入渠道表
    const retChannel = await this.channelService.create({
      name: value.name,
      type: value.type,
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

  @Get()
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
    // 查询当前用户的的渠道列表
    const channelList = await this.channelService.findAllByUserId(userId);
    const idList = channelList.map((item) => item._id);
    // 遍历查询渠道的回收量
    const channelCountList = await Promise.all(
      idList.map((item) => {
        return this.surveyResponseService.getSurveyResponseTotalByChannel({
          channelId: item,
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

  @Post(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() channel: Partial<Channel>,
    @Request() req
  ) {
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

  @Get(':id')
  @HttpCode(200)
  async find(
    @Param('id') id: string,
    @Request() req
  ) {
    try {
      const updateRes = await this.channelService.findOneById(id);
      this.logger.info(`updateRes: ${JSON.stringify(updateRes)}`);
      return {
        code: 200,
        data: updateRes,
      };
    } catch(e){
      throw new HttpException(
        `渠道不存在`,
        EXCEPTION_CODE.SURVEY_NOT_FOUND,
      );
    }
  }

  @Post('/status/:id')
  @HttpCode(200)
  async updateStatus(
    @Param('id') id: string,
    @Body() parama: Partial<{ status: DELIVER_STATUS }>,
    @Request() req
  ) {
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


  @Delete(':id')
  @HttpCode(200)
  async delete(@Param('id') id: string, @Request() req) {
    const operatorId = req.user._id.toString();
    const deleteRes = await this.channelService.delete(id, {operatorId});
    this.logger.info(`res: ${JSON.stringify(deleteRes)}`);
    return {
      code: 200,
    };
  }
}
