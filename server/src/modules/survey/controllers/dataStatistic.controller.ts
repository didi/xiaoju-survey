import {
  Controller,
  Get,
  Query,
  HttpCode,
  UseGuards,
  SetMetadata,
  Request,
} from '@nestjs/common';
import * as Joi from 'joi';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { DataStatisticService } from '../services/dataStatistic.service';
import { ResponseSchemaService } from '../../surveyResponse/services/responseScheme.service';

import { Authentication } from 'src/guards/authentication.guard';
import { XiaojuSurveyPluginManager } from 'src/securityPlugin/pluginManager';
import { SurveyGuard } from 'src/guards/survey.guard';
import { SURVEY_PERMISSION } from 'src/enums/surveyPermission';
import { Logger } from 'src/logger';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';

@ApiTags('survey')
@ApiBearerAuth()
@Controller('/api/survey/dataStatistic')
export class DataStatisticController {
  constructor(
    private readonly responseSchemaService: ResponseSchemaService,
    private readonly dataStatisticService: DataStatisticService,
    private readonly pluginManager: XiaojuSurveyPluginManager,
    private readonly logger: Logger,
  ) {}

  @Get('/dataTable')
  @HttpCode(200)
  @UseGuards(SurveyGuard)
  @SetMetadata('surveyId', 'query.surveyId')
  @SetMetadata('surveyPermission', [SURVEY_PERMISSION.SURVEY_RESPONSE_MANAGE])
  @UseGuards(Authentication)
  async data(
    @Query()
    queryInfo,
    @Request() req,
  ) {
    const { value, error } = await Joi.object({
      surveyId: Joi.string().required(),
      isDesensitive: Joi.boolean().default(true), // 默认true就是需要脱敏
      page: Joi.number().default(1),
      pageSize: Joi.number().default(10),
    }).validate(queryInfo);
    if (error) {
      this.logger.error(error.message, { req });
      throw new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    const { surveyId, isDesensitive, page, pageSize } = value;
    const responseSchema =
      await this.responseSchemaService.getResponseSchemaByPageId(surveyId);
    const { total, listHead, listBody } =
      await this.dataStatisticService.getDataTable({
        responseSchema,
        surveyId,
        pageNum: page,
        pageSize,
      });

    if (isDesensitive) {
      // 脱敏
      listBody.forEach((item) => {
        this.pluginManager.triggerHook('desensitiveData', item);
      });
    }

    return {
      code: 200,
      data: {
        total,
        listHead,
        listBody,
      },
    };
  }
}
