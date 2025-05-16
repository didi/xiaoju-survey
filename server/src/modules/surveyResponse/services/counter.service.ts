import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Counter } from 'src/models/counter.entity';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { Logger } from 'src/logger';
import { load } from 'cheerio';
@Injectable()
export class CounterService {
  constructor(
    @InjectRepository(Counter)
    private readonly counterRepository: MongoRepository<Counter>,
    private readonly logger: Logger,
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

  async checkAndUpdateOptionCount({
    optionInfoWithId,
    userAnswer,
    surveyPath,
  }: {
    optionInfoWithId: Record<
      string,
      Array<{ hash: string; text: string; quota?: number; title: string }>
    >;
    userAnswer: Record<string, any>;
    surveyPath: string;
  }) {
    const queryRunner =
      this.counterRepository.manager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      for (const field in userAnswer) {
        const value = userAnswer[field];
        const values = Array.isArray(value) ? value : [value];
        if (field in optionInfoWithId) {
          const counter = await queryRunner.manager.findOne(Counter, {
            where: {
              key: field,
              surveyPath,
              type: 'option',
            },
          });
          const optionCountData = counter?.data || {};

          //遍历选项hash值
          for (const val of values) {
            const option = optionInfoWithId[field].find(
              (opt) => opt['hash'] === val,
            );
            if (!option) {
              throw new HttpException(
                '选项不存在',
                EXCEPTION_CODE.PARAMETER_ERROR,
              );
            }
            if (!optionCountData[val]) {
              optionCountData[val] = 0;
            }
            optionCountData[val]++;
            if (!option.quota) {
              continue;
            }
            const quota = option.quota;
            if (quota && optionCountData[val] > quota) {
              const $option = load(option.text);
              const optionText = $option.text();
              const $title = load(option.title);
              const title = $title.text();
              throw new HttpException(
                `【${title}】的【${optionText}】配额已满，请重新选择`,
                EXCEPTION_CODE.RESPONSE_OVER_LIMIT,
                {
                  field,
                  optionHash: option.hash,
                },
              );
            }
          }
          if (!optionCountData['total']) {
            optionCountData['total'] = 1;
          } else {
            optionCountData['total']++;
          }
          const dataToSave = Object.assign(
            { _id: counter?._id },
            {
              key: field,
              surveyPath,
              type: 'option',
              data: optionCountData,
              updatedAt: new Date(),
            },
          );
          await queryRunner.manager.save(Counter, dataToSave);
        }
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(error.message);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
