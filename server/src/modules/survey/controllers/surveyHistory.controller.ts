import {
  Controller,
  Get,
  Query,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';

import { SurveyHistoryService } from '../services/surveyHistory.service';
import { SurveyMetaService } from '../services/surveyMeta.service';

import * as Joi from 'joi';
import { ApiTags } from '@nestjs/swagger';
import { Authtication } from 'src/guards/authtication';

@ApiTags('survey')
@Controller('/api/surveyHisotry')
export class SurveyHistoryController {
  constructor(
    private readonly surveyHistoryService: SurveyHistoryService,
    private readonly surveyMetaService: SurveyMetaService,
  ) {}

  @UseGuards(Authtication)
  @Get('/getList')
  @HttpCode(200)
  async getList(
    @Query()
    queryInfo: {
      surveyId: string;
      historyType: string;
    },
    @Request()
    req,
  ) {
    const validationResult = await Joi.object({
      surveyId: Joi.string().required(),
      historyType: Joi.string().required(),
    }).validateAsync(queryInfo);

    const username = req.user.username;
    const surveyId = validationResult.surveyId;
    const historyType = validationResult.historyType;
    await this.surveyMetaService.checkSurveyAccess({
      surveyId,
      username,
    });
    const data = await this.surveyHistoryService.getHistoryList({
      surveyId,
      historyType,
    });
    return {
      code: 200,
      data,
    };
  }
}
