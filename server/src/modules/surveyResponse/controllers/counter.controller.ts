import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { CounterService } from '../services/counter.service';
import { ApiTags } from '@nestjs/swagger';
import { Authtication } from 'src/guards/authtication';
import { UseGuards } from '@nestjs/common';

@ApiTags('surveyResponse')
@Controller('/api/counter')
export class CounterController {
  constructor(private readonly counterService: CounterService) {}

  @Get('/queryOptionCountInfo')
  @HttpCode(200)
  async queryOptionCountInfo(
    @Query()
    queryInfo: {
      surveyPath: string;
      fieldList: string;
    },
  ) {
    if (!queryInfo.surveyPath || !queryInfo.fieldList) {
      throw new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    const data = await this.counterService.getAll({
      surveyPath: queryInfo.surveyPath,
      type: 'option',
      keyList: queryInfo.fieldList.split(','),
    });
    return {
      code: 200,
      data: data,
    };
  }
}
