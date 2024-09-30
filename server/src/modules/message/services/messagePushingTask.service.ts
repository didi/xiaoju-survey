import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { MessagePushingTask } from 'src/models/messagePushingTask.entity';
import { MESSAGE_PUSHING_HOOK } from 'src/enums/messagePushing';
import { CreateMessagePushingTaskDto } from '../dto/createMessagePushingTask.dto';
import { UpdateMessagePushingTaskDto } from '../dto/updateMessagePushingTask.dto';
import { ObjectId } from 'mongodb';
import { MESSAGE_PUSHING_TYPE } from 'src/enums/messagePushing';
import { MessagePushingLogService } from './messagePushingLog.service';
import { httpPost } from 'src/utils/request';

@Injectable()
export class MessagePushingTaskService {
  constructor(
    @InjectRepository(MessagePushingTask)
    private readonly messagePushingTaskRepository: MongoRepository<MessagePushingTask>,
    private readonly messagePushingLogService: MessagePushingLogService,
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
      isDeleted: {
        $ne: true,
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

  findOne({
    id,
    ownerId,
  }: {
    id: string;
    ownerId: string;
  }): Promise<MessagePushingTask> {
    return this.messagePushingTaskRepository.findOne({
      where: {
        ownerId,
        _id: new ObjectId(id),
        isDeleted: {
          $ne: true,
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

  async remove({
    id,
    operator,
    operatorId,
  }: {
    id: string;
    operator: string;
    operatorId: string;
  }) {
    return this.messagePushingTaskRepository.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          isDeleted: true,
          operator,
          operatorId,
          deletedAt: new Date(),
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
        $set: {
          updatedAt: new Date(),
        },
      },
    );
  }

  async runResponseDataPush({ surveyId, sendData }) {
    try {
      // 数据推送
      const messagePushingTasks = await this.findAll({
        surveyId,
        hook: MESSAGE_PUSHING_HOOK.RESPONSE_INSERTED,
      });

      if (
        Array.isArray(messagePushingTasks) &&
        messagePushingTasks.length > 0
      ) {
        for (const task of messagePushingTasks) {
          switch (task.type) {
            case MESSAGE_PUSHING_TYPE.HTTP: {
              try {
                const res = await httpPost({
                  url: task.pushAddress,
                  body: sendData,
                });
                await this.messagePushingLogService.createPushingLog({
                  taskId: task._id.toString(),
                  request: sendData,
                  response: res,
                  status: res.status,
                });
              } catch (error) {
                await this.messagePushingLogService.createPushingLog({
                  taskId: task._id.toString(),
                  request: sendData,
                  response: error.data || error.message,
                  status: error.status || 500,
                });
              }
              break;
            }
            default:
              break;
          }
        }
      }
    } catch (error) {}
  }
}
