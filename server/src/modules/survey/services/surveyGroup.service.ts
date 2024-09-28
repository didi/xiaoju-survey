import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, Like } from 'typeorm';

import { SurveyGroup } from 'src/models/surveyGroup.entity';
import { SurveyMeta } from 'src/models/surveyMeta.entity';

@Injectable()
export class SurveyGroupService {
    constructor(
        @InjectRepository(SurveyGroup)
        private readonly SurveyGroup: MongoRepository<SurveyGroup>,
        @InjectRepository(SurveyMeta)
        private surveyMetaRepository: MongoRepository<SurveyMeta>,
        ) {}
  create(params: {
    name: string,
    ownerId: string
  }) {
    const newGroup = this.SurveyGroup.create({
        ...params,
      });
    return this.SurveyGroup.save(newGroup);;
  }

  async findAll(userId: string, name: string, skip: number, pageSize: number) {
    const total = await this.SurveyGroup.count();
    const list = await this.SurveyGroup.find({  
        skip: skip,
        take: pageSize,
        where: name ? { name: { $regex: name, $options: 'i' }, ownerId: userId } : { ownerId: userId },
    })
    const allList = await this.SurveyGroup.find({
        where: { ownerId: userId },
        select: [
            '_id',
            'name',
          ],
    })
    return {
        total,
        list,
        allList
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} surveyGroup`;
  }

  update(id: string,
    updatedFields: Partial<SurveyGroup>) {
        updatedFields.updatedAt = new Date()
    return this.SurveyGroup.update(id, updatedFields);
  }

  async remove(id: string) {
    const query = { groupId: id };
    const update = { $set: { groupId: null } };
    await this.surveyMetaRepository.updateMany(query, update);
    return this.SurveyGroup.delete(id);
  }
}
