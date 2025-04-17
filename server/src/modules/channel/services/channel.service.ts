import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

import { Channel } from 'src/models/channel.entity';

import { CHANNEL_STATUS, IDeliverDataItem } from '../../../enums/channel';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';

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

  async create(channel: Partial<Channel>): Promise<Channel> {
    channel.status = CHANNEL_STATUS.RECYCLING
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

  update({
    id,
    channel,
    operatorId,
  }: {
    id: string;
    channel: Partial<Channel>;
    operatorId: string,
  }) {
    return this.channelRepository.update(id, {
      name: channel.name,
      operatorId,
      updatedAt: new Date()
    });
  }

  async updateStatus({
    id,
    status,
    operatorId,
  }: {
    id: string;
    status: CHANNEL_STATUS;
    operatorId: string,
  }) {
    const channel = await this.channelRepository.findOne({
      where: {
        ownerId: operatorId,
        _id: new ObjectId(id),
        isDeleted: {
          $ne: true,
        },
      },
    });
    if(!channel) {
      throw new HttpException(
        '渠道不存在',
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    }
    if (channel?.status === status) {
      throw new HttpException(
        '状态操作异常',
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    } else {
      channel.status = status
      channel.operatorId = operatorId
      channel.updatedAt = new Date()

      return this.channelRepository.save(channel);
    }
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
        'status',
        'name',
        'ownerId',
        'createdAt',
      ],
    });
  }

  // 问卷下的所有渠道
  async findAllBySurveyId(surveyId: string) {
    return await this.channelRepository.find({
      where: {
        surveyId,
        isDeleted: {
          $ne: true,
        },
      },
      order: {
        _id: -1,
      },
      select: [
        '_id',
        'status',
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
