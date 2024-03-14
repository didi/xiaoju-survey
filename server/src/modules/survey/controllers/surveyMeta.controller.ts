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

import * as Joi from 'joi';
import { Authtication } from 'src/guards/authtication';
import moment from 'moment';

import { getFilter, getOrder } from 'src/utils/surveyUtil';

@Controller('/api/survey')
export class SurveyMetaController {
  constructor(private readonly surveyMetaService: SurveyMetaService) {}

  @UseGuards(Authtication)
  @Post('/updateMeta')
  @HttpCode(200)
  async updateMeta(@Body() reqBody, @Request() req) {
    const validationResult = await Joi.object({
      remark: Joi.string().allow(null).default(''),
      title: Joi.string().required(),
      surveyId: Joi.string().required(),
    }).validateAsync(reqBody, { allowUnknown: true });
    const username = req.user.username;
    const surveyId = validationResult.surveyId;
    const survey = await this.surveyMetaService.checkSurveyAccess({
      surveyId,
      username,
    });
    survey.title = validationResult.title;
    survey.remark = validationResult.remark;

    await this.surveyMetaService.editSurveyMeta(survey);

    return {
      code: 200,
    };
  }

  @UseGuards(Authtication)
  @Get('/getList')
  @HttpCode(200)
  async getList(
    @Query()
    queryInfo: {
      curPage: number;
      pageSize: number;
    },
    @Request()
    req,
  ) {
    const validationResult = await Joi.object({
      curPage: Joi.number().required(),
      pageSize: Joi.number().allow(null).default(10),
      filter: Joi.string().allow(null),
      order: Joi.string().allow(null),
    }).validateAsync(queryInfo);
    const { curPage, pageSize } = validationResult;
    let filter = {},
      order = {};
    if (validationResult.filter) {
      try {
        filter = getFilter(
          JSON.parse(decodeURIComponent(validationResult.filter)),
        );
      } catch (error) {
        console.log(error);
      }
    }
    if (validationResult.order) {
      try {
        order = order = getOrder(
          JSON.parse(decodeURIComponent(validationResult.order)),
        );
      } catch (error) {
        console.log(error);
      }
    }
    const username = req.user.username;
    const data = await this.surveyMetaService.getSurveyMetaList({
      pageNum: curPage,
      pageSize: pageSize,
      username,
      filter,
      order,
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
          item.createDate = moment(item.createDate).format(fmt);
          item.updateDate = moment(item.updateDate).format(fmt);
          item.curStatus.date = moment(item.curStatus.date).format(fmt);
          return item;
        }),
      },
    };
  }
}
