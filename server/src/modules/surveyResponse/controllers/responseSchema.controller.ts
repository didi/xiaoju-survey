import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { ResponseSchemaService } from '../services/responseScheme.service';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { RECORD_STATUS } from 'src/enums';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('surveyResponse')
@Controller('/api/responseSchema')
export class ResponseSchemaController {
  constructor(private readonly responseSchemaService: ResponseSchemaService) {}

  @Get('/getSchema')
  @HttpCode(200)
  async getSchema(
    @Query()
    queryInfo: {
      surveyPath: string;
    },
  ) {
    if (!queryInfo.surveyPath) {
      throw new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    const responseSchema =
      await this.responseSchemaService.getResponseSchemaByPath(
        queryInfo.surveyPath,
      );
    if (
      !responseSchema ||
      responseSchema.curStatus.status === RECORD_STATUS.REMOVED
    ) {
      throw new HttpException(
        '问卷已删除',
        EXCEPTION_CODE.RESPONSE_SCHEMA_REMOVED,
      );
    }
    return {
      code: 200,
      data: responseSchema,
    };
  }
}
