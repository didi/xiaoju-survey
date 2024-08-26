import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  SetMetadata,
  Request,
} from '@nestjs/common';
import * as Joi from 'joi';
import { ApiTags } from '@nestjs/swagger';

import { SessionService } from '../services/session.service';

import { Authentication } from 'src/guards/authentication.guard';
import { SurveyGuard } from 'src/guards/survey.guard';
import { SURVEY_PERMISSION } from 'src/enums/surveyPermission';
import { XiaojuSurveyLogger } from 'src/logger';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { SessionGuard } from 'src/guards/session.guard';

@ApiTags('survey')
@Controller('/api/session')
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly logger: XiaojuSurveyLogger,
  ) {}

  @Post('/create')
  @HttpCode(200)
  @UseGuards(SurveyGuard)
  @SetMetadata('surveyId', 'body.surveyId')
  @SetMetadata('surveyPermission', [SURVEY_PERMISSION.SURVEY_CONF_MANAGE])
  @UseGuards(Authentication)
  async create(
    @Body()
    reqBody: {
      surveyId: string;
    },
  ) {
    const { value, error } = Joi.object({
      surveyId: Joi.string().required(),
    }).validate(reqBody);

    if (error) {
      this.logger.error(error.message);
      throw new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR);
    }

    const surveyId = value.surveyId;
    const session = await this.sessionService.create({ surveyId });

    return {
      code: 200,
      data: {
        sessionId: session._id.toString(),
      },
    };
  }

  @Post('/seize')
  @HttpCode(200)
  @UseGuards(SessionGuard)
  @SetMetadata('sessionId', 'body.sessionId')
  @SetMetadata('surveyPermission', [SURVEY_PERMISSION.SURVEY_CONF_MANAGE])
  @UseGuards(Authentication)
  async seize(
    @Request()
    req,
  ) {
    const saveSession = req.saveSession;

    await this.sessionService.updateSessionToEditing({
      sessionId: saveSession._id.toString(),
      surveyId: saveSession.surveyId,
    });

    return {
      code: 200,
    };
  }
}
