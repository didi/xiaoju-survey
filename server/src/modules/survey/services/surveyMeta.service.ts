import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, FindOptionsOrder } from 'typeorm';
import { SurveyMeta } from 'src/models/surveyMeta.entity';
import { RECORD_STATUS, RECORD_SUB_STATUS } from 'src/enums';
import { ObjectId } from 'mongodb';
import { HttpException } from 'src/exceptions/httpException';
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

  async getSurveyById({ surveyId }) {
    return this.surveyRepository.findOne({
      where: { _id: new ObjectId(surveyId) },
    });
  }

  async createSurveyMeta(params: {
    title: string;
    remark: string;
    surveyType: string;
    username: string;
    userId: string;
    createMethod: string;
    createFrom: string;
    workspaceId?: string;
  }) {
    const {
      title,
      remark,
      surveyType,
      username,
      createMethod,
      createFrom,
      userId,
      workspaceId,
    } = params;
    const surveyPath = await this.getNewSurveyPath();
    const newSurvey = this.surveyRepository.create({
      title,
      remark: remark || '',
      surveyType: surveyType,
      surveyPath,
      creator: username,
      owner: username,
      ownerId: userId,
      createMethod,
      createFrom,
      workspaceId,
    });

    return await this.surveyRepository.save(newSurvey);
  }

  async editSurveyMeta(survey: SurveyMeta) {
    if (
      survey.curStatus.status !== RECORD_STATUS.NEW &&
      (survey.curStatus.status !== RECORD_SUB_STATUS.EDITING ||
        survey.subCurStatus.status !== RECORD_SUB_STATUS.EDITING) //添加字状态后兼容之前的数据
    ) {
      const newSubStatus = {
        status: RECORD_SUB_STATUS.EDITING,
        date: Date.now(),
      };
      survey.curStatus.status = RECORD_STATUS.PUBLISHED;
      survey.subCurStatus = newSubStatus;
      survey.statusList.push(newSubStatus);
    }
    return this.surveyRepository.save(survey);
  }

  async deleteSurveyMeta(survey: SurveyMeta) {
    //添加字状态后兼容之前的数据
    if (
      survey.curStatus.status === RECORD_SUB_STATUS.REMOVED ||
      survey.subCurStatus.status === RECORD_SUB_STATUS.REMOVED
    ) {
      throw new HttpException(
        '问卷已删除，不能重复删除',
        EXCEPTION_CODE.SURVEY_STATUS_TRANSFORM_ERROR,
      );
    }
    const newStatusInfo = {
      status: RECORD_SUB_STATUS.REMOVED,
      date: Date.now(),
    };
    survey.subCurStatus = newStatusInfo;
    if (Array.isArray(survey.statusList)) {
      survey.statusList.push(newStatusInfo);
    } else {
      survey.statusList = [newStatusInfo];
    }
    return this.surveyRepository.save(survey);
  }

  async pausingSurveyMeta(survey: SurveyMeta) {
    if (
      (survey.curStatus.status !== RECORD_STATUS.PUBLISHED &&
        survey.curStatus.status !== RECORD_SUB_STATUS.EDITING) ||
      (survey.subCurStatus.status &&
        survey.subCurStatus.status != RECORD_SUB_STATUS.EDITING)
    ) {
      throw new HttpException(
        '问卷不能暂停',
        EXCEPTION_CODE.SURVEY_STATUS_TRANSFORM_ERROR,
      );
    }
    const subCurStatus = {
      status: RECORD_SUB_STATUS.PAUSING,
      date: Date.now(),
    };
    survey.subCurStatus = subCurStatus;
    survey.curStatus.status = RECORD_STATUS.PUBLISHED;
    if (Array.isArray(survey.statusList)) {
      survey.statusList.push(subCurStatus);
    } else {
      survey.statusList = [subCurStatus];
    }
    return this.surveyRepository.save(survey);
  }

  async getSurveyMetaList(condition: {
    pageNum: number;
    pageSize: number;
    username: string;
    userId: string;
    filter: Record<string, any>;
    order: Record<string, any>;
    workspaceId?: string;
    surveyIdList?: Array<string>;
  }): Promise<{ data: any[]; count: number }> {
    const { pageNum, pageSize, userId, username, workspaceId, surveyIdList } =
      condition;
    const skip = (pageNum - 1) * pageSize;
    try {
      const query: Record<string, any> = Object.assign(
        {},
        {
          'curStatus.status': {
            $ne: 'removed',
          },
          'subCurStatus.status': {
            $ne: 'removed',
          },
        },
        condition.filter,
      );
      // 添加字状态后兼容之前的数据
      const status =
        condition.filter['curStatus.status'] ||
        condition.filter['subCurStatus.status'];
      if (status) {
        query['curStatus.status'] = {
          $ne: 'removed',
        };
        query['subCurStatus.status'] = {
          $ne: 'removed',
        };
      }

      if (workspaceId) {
        query.workspaceId = workspaceId;
      } else {
        query.workspaceId = {
          $exists: false,
        };
        // 引入空间之前，新建的问卷只有owner字段，引入空间之后，新建的问卷多了ownerId字段，使用owenrId字段进行关联更加合理，此处做了兼容
        query.$or = [
          {
            owner: username,
          },
          {
            ownerId: userId,
          },
        ];
        if (Array.isArray(surveyIdList) && surveyIdList.length > 0) {
          query.$or.push({
            _id: {
              $in: surveyIdList.map((item) => new ObjectId(item)),
            },
          });
        }
      }
      const order =
        condition.order && Object.keys(condition.order).length > 0
          ? (condition.order as FindOptionsOrder<SurveyMeta>)
          : ({
              createDate: -1,
            } as FindOptionsOrder<SurveyMeta>);

      let [data, count] = await this.surveyRepository.findAndCount({
        where: query,
        // skip,
        // take: pageSize,
        order,
      });
      // 添加字子状态后兼容之前的数据
      if (status) {
        if (condition.filter['curStatus.status']) {
          data = data.filter(
            (v) => v.curStatus.status === status && !v.subCurStatus.status,
          );
          count = data.length;
        }
        if (condition.filter['subCurStatus.status']) {
          data = data.filter(
            (v) =>
              v.subCurStatus.status == status || v.curStatus.status == status,
          );
          count = data.length;
        }
      }

      return { data: data.slice(skip, pageSize * pageNum), count };
    } catch (error) {
      return { data: [], count: 0 };
    }
  }

  async publishSurveyMeta({ surveyMeta }: { surveyMeta: SurveyMeta }) {
    const curStatus = {
      status: RECORD_STATUS.PUBLISHED,
      date: Date.now(),
    };
    const subCurStatus = {
      status: RECORD_SUB_STATUS.DEFAULT,
      date: Date.now(),
    };
    surveyMeta.curStatus = curStatus;
    surveyMeta.subCurStatus = subCurStatus;
    if (Array.isArray(surveyMeta.statusList)) {
      surveyMeta.statusList.push(curStatus);
    } else {
      surveyMeta.statusList = [curStatus];
    }
    return this.surveyRepository.save(surveyMeta);
  }

  async countSurveyMetaByWorkspaceId({ workspaceId }) {
    //添加字状态后兼容之前的数据
    const total = await this.surveyRepository.count({
      workspaceId,
      'curStatus.status': {
        $ne: RECORD_SUB_STATUS.REMOVED,
      },
      'subCurStatus.status': {
        $ne: RECORD_SUB_STATUS.REMOVED,
      },
    });
    return total;
  }
}
