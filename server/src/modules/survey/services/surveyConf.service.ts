import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { SurveyConf } from 'src/models/surveyConf.entity';
import { HttpException } from 'src/exceptions/httpException';
import { SurveyNotFoundException } from 'src/exceptions/surveyNotFoundException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { SurveySchemaInterface } from 'src/interfaces/survey';
import { getSchemaBySurveyType } from '../utils';

@Injectable()
export class SurveyConfService {
  constructor(
    @InjectRepository(SurveyConf)
    private readonly surveyConfRepository: MongoRepository<SurveyConf>,
  ) {}

  async createSurveyConf(params: {
    surveyId: string;
    surveyType: string;
    createMethod: string;
    createFrom: string;
  }) {
    const { surveyId, surveyType, createMethod, createFrom } = params;
    let schemaData = null;
    if (createMethod === 'copy') {
      const codeInfo = await this.getSurveyConfBySurveyId(createFrom);
      schemaData = codeInfo.code;
    } else {
      try {
        schemaData = await getSchemaBySurveyType(surveyType);
      } catch (error) {
        throw new HttpException(
          error.message,
          EXCEPTION_CODE.SURVEY_TYPE_ERROR,
        );
      }
    }

    const newCode = this.surveyConfRepository.create({
      pageId: surveyId,
      code: schemaData,
    });

    return this.surveyConfRepository.save(newCode);
  }

  async getSurveyConfBySurveyId(surveyId: string) {
    const code = await this.surveyConfRepository.findOne({
      where: { pageId: surveyId },
    });
    if (!code) {
      throw new SurveyNotFoundException('问卷配置不存在');
    }
    return code;
  }

  async saveSurveyConf(params: {
    surveyId: string;
    schema: SurveySchemaInterface;
  }) {
    const codeInfo = await this.getSurveyConfBySurveyId(params.surveyId);
    if (!codeInfo) {
      throw new SurveyNotFoundException('问卷配置不存在');
    }
    codeInfo.code = params.schema;
    await this.surveyConfRepository.save(codeInfo);
  }

  async getSurveyContentByCode(codeInfo: SurveySchemaInterface) {
    const dataList = codeInfo.dataConf.dataList;
    const arr: Array<string> = [];
    for (const item of dataList) {
      arr.push(item.title);
      if (Array.isArray(item.options)) {
        for (const option of item.options) {
          arr.push(option.text);
        }
      }
    }
    return {
      text: arr.join('\n'),
    };
  }
}
