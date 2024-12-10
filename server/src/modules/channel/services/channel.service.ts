import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

import { Channel } from 'src/models/channel.entity';
import { SurveyResponse } from 'src/models/surveyResponse.entity';

import { DELIVER_STATUS, DELIVER_TYPE, IDeliverDataItem } from '../../../enums/channel';


interface FindAllByIdWithPaginationParams {
  idList: ObjectId[];
  page: number;
  limit: number;
  name?: string;
}
interface FindAllByIdWithPaginationResult {
  list: IDeliverDataItem[];
  count: number;
}

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: MongoRepository<Channel>,
  ) {}

  async create(channel: {
    name: string;
    type: DELIVER_TYPE;
    ownerId: string;
  }): Promise<Channel> {
    const newChannel = this.channelRepository.create({
      ...channel,
    });
    return this.channelRepository.save(newChannel);
  }

  async findOneById(id) {
    return this.channelRepository.findOne({
      where: {
        _id: new ObjectId(id),
      },
    });
  }

  async delete(id: string, { operatorId }) {
    const workspaceRes = await this.channelRepository.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          operatorId,
        },
      },
    );
    return {
      workspaceRes,
    };
  }

  // 用户下的所有渠道
  async findAllByUserId(userId: string) {
    return await this.channelRepository.find({
      where: {
        ownerId: userId,
        isDeleted: {
          $ne: true,
        },
      },
      order: {
        _id: -1,
      },
      select: [
        '_id',
        'curStatus',
        'name',
        'ownerId',
        'createdAt',
      ],
    });
  }

  // 分页查询
  async findAllByIdWithPagination({
    idList,
    page,
    limit,
    name,
  }: FindAllByIdWithPaginationParams): Promise<FindAllByIdWithPaginationResult> {
    const skip = (page - 1) * limit;
    if (!Array.isArray(idList) || idList.length === 0) {
      return { list: [], count: 0 };
    }
    const query = {
      _id: {
        $in: idList.map((m) => new ObjectId(m)),
      },
      isDeleted: {
        $ne: true,
      },
    };
    if (name) {
      query['name'] = { $regex: name, $options: 'i' };
    }
    const [data, count] = await this.channelRepository.findAndCount({
      where: query,
      skip,
      take: limit,
      order: {
        createdAt: -1,
      },
    });
    return { list: data as any, count };
  }
}
