import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Counter } from 'src/models/counter.entity';

@Injectable()
export class CounterService {
  constructor(
    @InjectRepository(Counter)
    private readonly counterRepository: MongoRepository<Counter>,
  ) {}

  async set({
    surveyPath,
    key,
    data,
    type,
  }: {
    surveyPath: string;
    key: string;
    data: Record<string, any>;
    type: string;
  }) {
    return this.counterRepository.updateOne(
      {
        key,
        surveyPath,
        type,
      },
      {
        $set: {
          key,
          surveyPath,
          type,
          data,
        },
      },
      {
        upsert: true,
      },
    );
  }

  async get({ surveyPath, key, type }): Promise<Record<string, any>> {
    const countData = await this.counterRepository.findOne({
      where: {
        key,
        surveyPath,
        type,
      },
    });
    return countData?.data;
  }

  async getAll({ surveyPath, keyList, type }) {
    const res = await this.counterRepository.find({
      where: {
        key: { $in: keyList },
        surveyPath,
        type,
      },
    });
    return res.reduce((pre, cur) => {
      pre[cur.key] = cur.data;
      return pre;
    }, {});
  }

  async createCounters({ surveyPath, dataList}) {
    const optionList = dataList.filter((questionItem) => {
      return (
        Array.isArray(questionItem.options) &&
        questionItem.options.length > 0
      );
    });
    optionList.forEach(option => {
      let data = {};
      option.options.forEach(option => {
        data[option.hash] = 0;
      });
      data["total"] = 0;
      this.set({
        surveyPath,
        key: option.field,
        type: 'option',
        data: data
      });
    });
  }
}
