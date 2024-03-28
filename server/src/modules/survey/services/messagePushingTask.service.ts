import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { MessagePushingTask } from 'src/models/messagePushingTask.entity';
import { MESSAGE_PUSHING_HOOK } from 'src/enums/messagePushing';
import { CreateMessagePushingTaskDto } from '../dto/createMessagePushingTask.dto';
import { UpdateMessagePushingTaskDto } from '../dto/updateMessagePushingTask.dto';
import { ObjectId } from 'mongodb';
import { RECORD_STATUS } from 'src/enums';

@Injectable()
export class MessagePushingTaskService {
  constructor(
    @InjectRepository(MessagePushingTask)
    private readonly messagePushingTaskRepository: MongoRepository<MessagePushingTask>,
  ) {}

  async create(
    createMessagePushingTaskDto: CreateMessagePushingTaskDto & {
      ownerId: string;
    },
  ): Promise<MessagePushingTask> {
    const createdTask = this.messagePushingTaskRepository.create(
      createMessagePushingTaskDto,
    );
    createdTask.creatorId = createdTask.ownerId;
    if (!createdTask.surveys) {
      createdTask.surveys = [];
    }
    return await this.messagePushingTaskRepository.save(createdTask);
  }

  async findAll({
    surveyId,
    hook,
    ownerId,
  }: {
    surveyId?: string;
    hook?: MESSAGE_PUSHING_HOOK;
    ownerId?: string;
  }): Promise<MessagePushingTask[]> {
    const where: Record<string, any> = {
      'curStatus.status': {
        $ne: RECORD_STATUS.REMOVED,
      },
    };
    if (surveyId) {
      where.surveys = {
        $all: [surveyId],
      };
    }
    if (hook) {
      where.triggerHook = hook;
    }
    if (ownerId) {
      where.ownerId = ownerId;
    }
    return await this.messagePushingTaskRepository.find({
      where,
    });
  }

  async findOne({
    id,
    ownerId,
  }: {
    id: string;
    ownerId: string;
  }): Promise<MessagePushingTask> {
    return await this.messagePushingTaskRepository.findOne({
      where: {
        ownerId,
        _id: new ObjectId(id),
        'curStatus.status': {
          $ne: RECORD_STATUS.REMOVED,
        },
      },
    });
  }

  async update({
    ownerId,
    id,
    updateData,
  }: {
    ownerId: string;
    id: string;
    updateData: UpdateMessagePushingTaskDto;
  }): Promise<MessagePushingTask> {
    const existingTask = await this.messagePushingTaskRepository.findOne({
      where: {
        ownerId,
        _id: new ObjectId(id),
      },
    });
    if (!existingTask) {
      throw new Error(`Message pushing task with id ${id} not found.`);
    }
    const updatedTask = Object.assign(existingTask, updateData);
    return await this.messagePushingTaskRepository.save(updatedTask);
  }

  async remove({ id, ownerId }: { id: string; ownerId: string }) {
    const curStatus = {
      status: RECORD_STATUS.REMOVED,
      date: Date.now(),
    };
    return this.messagePushingTaskRepository.updateOne(
      {
        ownerId,
        _id: new ObjectId(id),
        'curStatus.status': {
          $ne: RECORD_STATUS.REMOVED,
        },
      },
      {
        $set: {
          curStatus,
        },
        $push: {
          statusList: curStatus as never,
        },
      },
    );
  }

  async surveyAuthorizeTask({
    taskId,
    surveyId,
    ownerId,
  }: {
    taskId: string;
    surveyId: string;
    ownerId: string;
  }) {
    return this.messagePushingTaskRepository.updateOne(
      {
        _id: new ObjectId(taskId),
        surveys: { $nin: [surveyId] },
        ownerId,
      },
      {
        $push: {
          surveys: surveyId as never,
        },
      },
    );
  }
}
