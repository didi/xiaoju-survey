import {
  Controller,
  Get,
  Query,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';

import { DataStatisticService } from '../services/dataStatistic.service';
import { SurveyMetaService } from '../services/surveyMeta.service';
import { ResponseSchemaService } from '../../surveyResponse/services/responseScheme.service';

import * as Joi from 'joi';
import { ApiTags } from '@nestjs/swagger';
import { Authtication } from 'src/guards/authtication';
import { XiaojuSurveyPluginManager } from 'src/securityPlugin/pluginManager';

@ApiTags('survey')
@Controller('/api/survey/dataStatistic')
export class DataStatisticController {
  constructor(
    private readonly surveyMetaService: SurveyMetaService,
    private readonly responseSchemaService: ResponseSchemaService,
    private readonly dataStatisticService: DataStatisticService,
    private readonly pluginManager: XiaojuSurveyPluginManager,
  ) {}

  @UseGuards(Authtication)
  @Get('/dataTable')
  @HttpCode(200)
  async data(
    @Query()
    queryInfo,
    @Request()
    req,
  ) {
    const validationResult = await Joi.object({
      surveyId: Joi.string().required(),
      isDesensitive: Joi.boolean().default(true), // 默认true就是需要脱敏
      page: Joi.number().default(1),
      pageSize: Joi.number().default(10),
    }).validateAsync(queryInfo);
    const { surveyId, isDesensitive, page, pageSize } = validationResult;
    const username = req.user.username;
    await this.surveyMetaService.checkSurveyAccess({
      surveyId,
      username,
    });
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
