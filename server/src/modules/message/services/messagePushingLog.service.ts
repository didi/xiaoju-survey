import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { MessagePushingLog } from 'src/models/messagePushingLog.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class MessagePushingLogService {
  constructor(
    @InjectRepository(MessagePushingLog)
    private readonly messagePushingLogRepository: MongoRepository<MessagePushingLog>,
  ) {}

  async createPushingLog({
    taskId,
    request,
    response,
    status,
  }): Promise<MessagePushingLog> {
    const createdLog = this.messagePushingLogRepository.create({
      taskId,
      request,
      response,
      status,
    });
    return await this.messagePushingLogRepository.save(createdLog);
  }

  async findAllByTaskId(taskId: string): Promise<MessagePushingLog[]> {
    return await this.messagePushingLogRepository.find({
      where: {
        taskId,
      },
    });
  }

  async findOne(id: string): Promise<MessagePushingLog> {
    return await this.messagePushingLogRepository.findOne({
      where: {
        _id: new ObjectId(id),
      },
    });
  }
}
