import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { SurveyConf } from 'src/models/surveyConf.entity';
import { HttpException } from 'src/exceptions/httpException';
import { SurveyNotFoundException } from 'src/exceptions/surveyNotFoundException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { SurveySchemaInterface } from 'src/interfaces/survey';
import { getSchemaBySurveyType } from '../utils';
import { I18nService } from 'nestjs-i18n';
import { translateI18nKeys } from '../utils/i18n';
import moment from 'moment';

@Injectable()
export class SurveyConfService {
  constructor(
    @InjectRepository(SurveyConf)
    private readonly surveyConfRepository: MongoRepository<SurveyConf>,
    private readonly i18n: I18nService,
  ) {}

  async createSurveyConf(params: {
    surveyId: string;
    surveyType: string;
    createMethod: string;
    createFrom: string;
    questionList?: Array<any>;
    language?: string;
  }) {
    const {
      surveyId,
      surveyType,
      createMethod,
      createFrom,
      questionList,
      language,
    } = params;
    let schemaData = null;
    if (createMethod === 'copy') {
      const codeInfo = await this.getSurveyConfBySurveyId(createFrom);
      schemaData = codeInfo.code;
    } else {
      try {
        schemaData = await getSchemaBySurveyType(surveyType);
        schemaData = await translateI18nKeys(schemaData, this.i18n, {
          lang: language,
        });

        if (questionList && questionList.length > 0) {
          schemaData.dataConf.dataList = questionList;
        }
      } catch (error) {
        throw new HttpException(
          error.message,
          EXCEPTION_CODE.SURVEY_TYPE_ERROR,
        );
      }
    }
    schemaData.baseConf.languageCode = language;

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

  async getSurveyConfBySurveyIds(surveyIds: string[]) {
    if (!surveyIds?.length) return [];
    const list = await this.surveyConfRepository.find({
      where: {
        pageId: { $in: surveyIds },
      },
      // select: ['_id', 'title', 'language', 'remark', 'surveyPath', 'curStatus'],
    });

    return list.map((item) => {
      const baseConf = item?.code?.baseConf;

      if (baseConf) {
        const toISOString = (val: unknown) => {
          const m = moment(val);
          return m.isValid() ? m.toISOString() : null;
        };

        baseConf.beginTime = toISOString(baseConf.beginTime);
        baseConf.endTime = toISOString(baseConf.endTime);
      }

      return item;
    });
  }
}
