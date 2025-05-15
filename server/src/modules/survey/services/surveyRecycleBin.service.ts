import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, MongoRepository, ObjectLiteral } from 'typeorm';

import { SurveyMeta } from 'src/models/surveyMeta.entity';
import { SurveyRecycle } from '../../../models/surveyRecycleBin.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class SurveyRecycleBinService {
  constructor(
    @InjectRepository(SurveyRecycle)
    private readonly surveyRecycleRepository: MongoRepository<SurveyRecycle>,
    @InjectRepository(SurveyMeta)
    private surveyMetaRepository: MongoRepository<SurveyMeta>,
  ) {}

  async countSurveyRecycle(ownerId: string) {
    const count = await this.surveyRecycleRepository.count({
      ownerId: ownerId,
      foreverDeleted: false,
    });
    return count;
  }

  async addSurveyRecycle(pageId: string) {
    const surveyMeta = await this.surveyMetaRepository.findOne({
      where: {
        _id: new ObjectId(pageId),
      },
    });
    if (!surveyMeta) {
      return null;
    }
    const newSurveyRecycle = this.surveyRecycleRepository.create({
      title: surveyMeta.title,
      surveyMetaCreateAt: surveyMeta.createdAt,
      ownerId: surveyMeta.ownerId,
      owner: surveyMeta.owner,
      pageId: pageId,
      foreverDeleted: false,
    });
    return await this.surveyRecycleRepository.save(newSurveyRecycle);
  }

  async getSurveyRecycleList(condition: {
    pageNum: number;
    pageSize: number;
    userId: string;
    filter: Record<string, any>;
  }): Promise<{ data: any[]; count: number }> {
    const { pageNum, pageSize, userId } = condition;
    const skip = (pageNum - 1) * pageSize;
    try {
      const query: ObjectLiteral = Object.assign(
        {
          foreverDeleted: {
            $ne: true,
          },
          ownerId: {
            $eq: userId,
          },
        },
        condition.filter,
      );

      const order = {
        createdAt: -1,
      } as FindOptionsOrder<SurveyRecycle>;

      const [data, count] = await this.surveyRecycleRepository.findAndCount({
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
}
