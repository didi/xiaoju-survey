import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

import { SurveyGroup } from 'src/models/surveyGroup.entity';
import { SurveyMeta } from 'src/models/surveyMeta.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class SurveyGroupService {
  constructor(
    @InjectRepository(SurveyGroup)
    private readonly surveyGroupRepository: MongoRepository<SurveyGroup>,
    @InjectRepository(SurveyMeta)
    private surveyMetaRepository: MongoRepository<SurveyMeta>,
  ) {}
  create(params: { name: string; ownerId: string }) {
    const newGroup = this.surveyGroupRepository.create({
      ...params,
    });
    return this.surveyGroupRepository.save(newGroup);
  }

  async findAll(userId: string, name: string, skip: number, pageSize: number) {
    const [list, total] = await this.surveyGroupRepository.findAndCount({
      skip: skip,
      take: pageSize,
      where: name
        ? { name: { $regex: name, $options: 'i' }, ownerId: userId }
        : { ownerId: userId },
      order: {
        createdAt: -1,
      },
    });
    const allList = await this.surveyGroupRepository.find({
      where: { ownerId: userId },
      select: ['_id', 'name'],
    });
    return {
      total,
      list,
      allList,
    };
  }

  async findOne(id: string) {
    return this.surveyGroupRepository.findOne({
      where: {
        _id: new ObjectId(id),
      },
    });
  }

  async update(id: string, updatedFields: Partial<SurveyGroup>) {
    updatedFields.updatedAt = new Date();
    return this.surveyGroupRepository.update(id, updatedFields);
  }

  async remove(id: string) {
    const query = { groupId: id };
    const update = { $set: { groupId: null } };
    await this.surveyMetaRepository.updateMany(query, update);
    return this.surveyGroupRepository.delete(id);
  }
}
