import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { SurveyResponse } from 'src/models/surveyResponse.entity';

import moment from 'moment';
import { keyBy } from 'lodash';
import { DataItem } from 'src/interfaces/survey';
import { ResponseSchema } from 'src/models/responseSchema.entity';
import { getListHeadByDataList } from '../utils';
@Injectable()
export class DataStatisticService {
  private radioType = ['radio-star', 'radio-nps'];

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
      'curStatus.status': {
        $ne: 'removed',
      },
    };
    const [surveyResponseList, total] =
      await this.surveyResponseRepository.findAndCount({
        where,
        take: pageSize,
        skip: (pageNum - 1) * pageSize,
        order: {
          createDate: -1,
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
          this.radioType.includes(itemConfig.type) &&
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
        difTime: (submitedData.difTime / 1000).toFixed(2),
        createDate: moment(submitedData.createDate).format(
          'YYYY-MM-DD HH:mm:ss',
        ),
      };
    });
    return {
      total,
      listHead,
      listBody,
    };
  }
}
