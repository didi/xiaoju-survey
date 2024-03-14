import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, FindOptionsOrder } from 'typeorm';
import { SurveyMeta } from 'src/models/surveyMeta.entity';
import { RECORD_STATUS } from 'src/enums';
import { ObjectId } from 'mongodb';
import { NoSurveyPermissionException } from 'src/exceptions/noSurveyPermissionException';
import { HttpException } from 'src/exceptions/httpException';
import { SurveyNotFoundException } from 'src/exceptions/surveyNotFoundException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { XiaojuSurveyPluginManager } from 'src/securityPlugin/pluginManager';

@Injectable()
export class SurveyMetaService {
  constructor(
    @InjectRepository(SurveyMeta)
    private readonly surveyRepository: MongoRepository<SurveyMeta>,
    private readonly pluginManager: XiaojuSurveyPluginManager,
  ) {}

  async getNewSurveyPath(): Promise<string> {
    let surveyPath = await this.pluginManager.triggerHook('genSurveyPath');
    while (true) {
      const count = await this.surveyRepository.count({
        where: {
          surveyPath,
        },
      });
      if (count === 0) {
        break;
      }
      surveyPath = await this.pluginManager.triggerHook('genSurveyPath');
    }
    return surveyPath;
  }

  async checkSurveyAccess({ surveyId, username }) {
    const survey = await this.surveyRepository.findOne({
      where: { _id: new ObjectId(surveyId) },
    });

    if (!survey) {
      throw new SurveyNotFoundException('问卷不存在');
    }
    if (survey.owner !== username) {
      throw new NoSurveyPermissionException('没有权限');
    }
    return survey;
  }

  async createSurveyMeta(params: {
    title: string;
    remark: string;
    surveyType: string;
    username: string;
    createMethod: string;
    createFrom: string;
  }) {
    const { title, remark, surveyType, username, createMethod, createFrom } =
      params;
    const surveyPath = await this.getNewSurveyPath();
    const newSurvey = this.surveyRepository.create({
      title,
      remark: remark || '',
      surveyType: surveyType,
      surveyPath,
      creator: username,
      owner: username,
      createMethod,
      createFrom,
    });

    return await this.surveyRepository.save(newSurvey);
  }

  async editSurveyMeta(survey: SurveyMeta) {
    if (
      survey.curStatus.status !== RECORD_STATUS.NEW &&
      survey.curStatus.status !== RECORD_STATUS.EDITING
    ) {
      const newStatus = {
        status: RECORD_STATUS.EDITING,
        date: Date.now(),
      };
      survey.curStatus = newStatus;
      survey.statusList.push(newStatus);
    }
    return this.surveyRepository.save(survey);
  }

  async deleteSurveyMeta(survey: SurveyMeta) {
    if (survey.curStatus.status === RECORD_STATUS.REMOVED) {
      throw new HttpException(
        '问卷已删除，不能重复删除',
        EXCEPTION_CODE.SURVEY_STATUS_TRANSFORM_ERROR,
      );
    }
    const newStatusInfo = {
      status: RECORD_STATUS.REMOVED,
      date: Date.now(),
    };
    survey.curStatus = newStatusInfo;
    if (Array.isArray(survey.statusList)) {
      survey.statusList.push(newStatusInfo);
    } else {
      survey.statusList = [newStatusInfo];
    }
    return this.surveyRepository.save(survey);
  }

  async getSurveyMetaList(condition: {
    pageNum: number;
    pageSize: number;
    username: string;
    filter: Record<string, any>;
    order: Record<string, any>;
  }): Promise<{ data: any[]; count: number }> {
    const { pageNum, pageSize, username } = condition;
    const skip = (pageNum - 1) * pageSize;
    try {
      const query = Object.assign(
        {},
        {
          owner: username,
          'curStatus.status': {
            $ne: 'removed',
          },
        },
        condition.filter,
      );
      const order =
        condition.order && Object.keys(condition.order).length > 0
          ? (condition.order as FindOptionsOrder<SurveyMeta>)
          : ({
              createDate: -1,
            } as FindOptionsOrder<SurveyMeta>);

      const [data, count] = await this.surveyRepository.findAndCount({
        where: query,
        skip,
        take: pageSize,
        order,
      });
      return { data, count };
    } catch (error) {
      return { data: [], count: 0 };
    }
  }

  async publishSurveyMeta({ surveyMeta }: { surveyMeta: SurveyMeta }) {
    const curStatus = {
      status: RECORD_STATUS.PUBLISHED,
      date: Date.now(),
    };
    surveyMeta.curStatus = curStatus;
    if (Array.isArray(surveyMeta.statusList)) {
      surveyMeta.statusList.push(curStatus);
    } else {
      surveyMeta.statusList = [curStatus];
    }
    return this.surveyRepository.save(surveyMeta);
  }
}
