import {
  Controller,
  Get,
  Query,
  HttpCode,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import * as Joi from 'joi';
import { ApiTags } from '@nestjs/swagger';

import { SurveyHistoryService } from '../services/surveyHistory.service';

import { Authentication } from 'src/guards/authentication.guard';
import { SurveyGuard } from 'src/guards/survey.guard';
import { SURVEY_PERMISSION } from 'src/enums/surveyPermission';
import { Logger } from 'src/logger';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
@ApiTags('survey')
@Controller('/api/surveyHistory')
export class SurveyHistoryController {
  constructor(
    private readonly surveyHistoryService: SurveyHistoryService,
    private readonly logger: Logger,
  ) {}

  @Get('/getList')
  @HttpCode(200)
  @UseGuards(SurveyGuard)
  @SetMetadata('surveyId', 'query.surveyId')
  @SetMetadata('surveyPermission', [
    SURVEY_PERMISSION.SURVEY_CONF_MANAGE,
    SURVEY_PERMISSION.SURVEY_COOPERATION_MANAGE,
    SURVEY_PERMISSION.SURVEY_RESPONSE_MANAGE,
  ])
  @UseGuards(Authentication)
  async getList(
    @Query()
    queryInfo: {
      surveyId: string;
      historyType: string;
    },
  ) {
    const { value, error } = Joi.object({
      surveyId: Joi.string().required(),
      historyType: Joi.string().required(),
    }).validate(queryInfo);

    if (error) {
      this.logger.error(error.message);
      throw new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR);
    }

    const surveyId = value.surveyId;
    const historyType = value.historyType;
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
