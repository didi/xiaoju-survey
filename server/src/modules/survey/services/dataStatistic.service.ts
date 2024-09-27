import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { SurveyResponse } from 'src/models/surveyResponse.entity';

import moment from 'moment';
import { keyBy } from 'lodash';
import { DataItem } from 'src/interfaces/survey';
import { ResponseSchema } from 'src/models/responseSchema.entity';
import { getListHeadByDataList, transformAndMergeArrayFields } from '../utils';
import { QUESTION_TYPE } from 'src/enums/question';
@Injectable()
export class DataStatisticService {
  private radioType = [QUESTION_TYPE.RADIO_STAR, QUESTION_TYPE.RADIO_NPS];

  constructor(
    @InjectRepository(SurveyResponse)
    private readonly surveyResponseRepository: MongoRepository<SurveyResponse>,
  ) {}

  async getDataTable({
    surveyId,
    pageNum,
    pageSize,
    responseSchema,
  }: {
    surveyId: string;
    pageNum: number;
    pageSize: number;
    responseSchema: ResponseSchema;
  }) {
    const dataList = responseSchema?.code?.dataConf?.dataList || [];
    const listHead = getListHeadByDataList(dataList);
    const dataListMap = keyBy(dataList, 'field');
    const where = {
      pageId: surveyId,
      isDeleted: {
        $ne: true,
      },
    };
    const [surveyResponseList, total] =
      await this.surveyResponseRepository.findAndCount({
        where,
        take: pageSize,
        skip: (pageNum - 1) * pageSize,
        order: {
          createdAt: -1,
        },
      });

    const listBody = surveyResponseList.map((submitedData) => {
      const data = submitedData.data;
      const dataKeys = Object.keys(data);

      for (const itemKey of dataKeys) {
        if (typeof itemKey !== 'string') {
          continue;
        }
        if (itemKey.indexOf('data') !== 0) {
          continue;
        }
        // 获取题目id
        const itemConfigKey = itemKey.split('_')[0];
        // 获取题目
        const itemConfig: DataItem = dataListMap[itemConfigKey];
        // 题目删除会出现，数据列表报错
        if (!itemConfig) {
          continue;
        }
        // 处理选项的更多输入框
        if (
          this.radioType.includes(itemConfig.type as QUESTION_TYPE) &&
          !data[`${itemConfigKey}_custom`]
        ) {
          data[`${itemConfigKey}_custom`] =
            data[`${itemConfigKey}_${data[itemConfigKey]}`];
        }
        // 将选项id还原成选项文案
        if (
          Array.isArray(itemConfig.options) &&
          itemConfig.options.length > 0
        ) {
          const optionTextMap = keyBy(itemConfig.options, 'hash');
          data[itemKey] = Array.isArray(data[itemKey])
            ? data[itemKey]
                .map((item) => optionTextMap[item]?.text || item)
                .join(',')
            : optionTextMap[data[itemKey]]?.text || data[itemKey];
        }
      }
      return {
        ...data,
        diffTime: submitedData.diffTime
          ? (submitedData.diffTime / 1000).toFixed(2)
          : '0',
        createdAt: moment(submitedData.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      };
    });
    return {
      total,
      listHead,
      listBody,
    };
  }

  async aggregationStatis({ surveyId, fieldList }) {
    const $facet = fieldList.reduce((pre, cur) => {
      const $match = { $match: { [`data.${cur}`]: { $nin: [[], '', null] } } };
      const $group = { $group: { _id: `$data.${cur}`, count: { $sum: 1 } } };
      const $project = {
        $project: {
          _id: 0,
          count: 1,
          secretKeys: 1,
          sensitiveKeys: 1,
          [`data.${cur}`]: '$_id',
        },
      };
      pre[cur] = [$match, $group, $project];
      return pre;
    }, {});
    const aggregation = this.surveyResponseRepository.aggregate(
      [
        {
          $match: {
            pageId: surveyId,
            isDeleted: {
              $ne: true,
            },
          },
        },
        { $facet },
      ],
      { maxTimeMS: 30000, allowDiskUse: true },
    );
    const res = await aggregation.next();
    const submitionCountMap: Record<string, number> = {};
    for (const field in res) {
      let count = 0;
      if (Array.isArray(res[field])) {
        for (const optionItem of res[field]) {
          count += optionItem.count;
        }
      }
      submitionCountMap[field] = count;
    }
    const transformedData = transformAndMergeArrayFields(res);
    return fieldList.map((field) => {
      return {
        field,
        data: {
          aggregation: (transformedData?.[field] || []).map((optionItem) => {
            return {
              id: optionItem.data[field],
              count: optionItem.count,
            };
          }),
          submitionCount: submitionCountMap?.[field] || 0,
        },
      };
    });
  }
}
