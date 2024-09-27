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
          updatedAt: new Date(),
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
}
