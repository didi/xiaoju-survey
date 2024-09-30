import { Test, TestingModule } from '@nestjs/testing';

import { MongoRepository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';

import { MessagePushingTaskService } from '../services/messagePushingTask.service';
import { MessagePushingLogService } from '../services/messagePushingLog.service';

import { CreateMessagePushingTaskDto } from '../dto/createMessagePushingTask.dto';
import { UpdateMessagePushingTaskDto } from '../dto/updateMessagePushingTask.dto';

import { MESSAGE_PUSHING_TYPE } from 'src/enums/messagePushing';
import { MESSAGE_PUSHING_HOOK } from 'src/enums/messagePushing';
import { MessagePushingTask } from 'src/models/messagePushingTask.entity';

describe('MessagePushingTaskService', () => {
  let service: MessagePushingTaskService;
  let repository: MongoRepository<MessagePushingTask>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagePushingTaskService,
        {
          provide: getRepositoryToken(MessagePushingTask),
          useClass: MongoRepository,
        },
        {
          provide: MessagePushingLogService,
          useValue: {
            createPushingLog: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MessagePushingTaskService>(MessagePushingTaskService);
    repository = module.get<MongoRepository<MessagePushingTask>>(
      getRepositoryToken(MessagePushingTask),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new message pushing task', async () => {
      const createDto: CreateMessagePushingTaskDto = {
        name: 'Test Task',
        type: MESSAGE_PUSHING_TYPE.HTTP,
        pushAddress: 'http://example.com',
        triggerHook: MESSAGE_PUSHING_HOOK.RESPONSE_INSERTED,
        surveys: ['surveyId1', 'surveyId2'],
      };

      const savedTask = new MessagePushingTask();
      savedTask.name = 'Test Task';
      savedTask.type = MESSAGE_PUSHING_TYPE.HTTP;
      savedTask.pushAddress = 'http://example.com';
      savedTask.triggerHook = MESSAGE_PUSHING_HOOK.RESPONSE_INSERTED;

      const mockOwnerId = '66028642292c50f8b71a9eee';

      jest.spyOn(repository, 'create').mockReturnValue(savedTask);
      jest.spyOn(repository, 'save').mockResolvedValue(savedTask);

      const result = await service.create({
        ...createDto,
        ownerId: mockOwnerId,
      });

      expect(result).toEqual(savedTask);
      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        ownerId: mockOwnerId,
      });
      expect(repository.save).toHaveBeenCalledWith(savedTask);
    });
  });

  describe('findAll', () => {
    it('should find message pushing tasks by survey id and trigger hook', async () => {
      const surveyId = 'surveyId';
      const hook = MESSAGE_PUSHING_HOOK.RESPONSE_INSERTED;
      const tasks = [
        {
          _id: new ObjectId(),
          name: 'Task 1',
          type: MESSAGE_PUSHING_TYPE.HTTP,
          pushAddress: '',
        },
        {
          _id: new ObjectId(),
          name: 'Task 2',
          type: MESSAGE_PUSHING_TYPE.HTTP,
          pushAddress: '',
        },
      ];

      jest
        .spyOn(repository, 'find')
        .mockResolvedValue(tasks as MessagePushingTask[]);
      const mockOwnerId = '66028642292c50f8b71a9eee';

      const result = await service.findAll({
        surveyId,
        hook,
        ownerId: mockOwnerId,
      });

      expect(result).toEqual(tasks);
      expect(repository.find).toHaveBeenCalledWith({
        where: {
          isDeleted: {
            $ne: true,
          },
          ownerId: mockOwnerId,
          surveys: { $all: [surveyId] },
          triggerHook: hook,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should find a message pushing task by id', async () => {
      const taskId = '65afc62904d5db18534c0f78';
      const task = { _id: new ObjectId(), name: 'Test Task' };
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(task as MessagePushingTask);

      const mockOwnerId = '66028642292c50f8b71a9eee';
      const result = await service.findOne({
        id: taskId,
        ownerId: mockOwnerId,
      });

      expect(result).toEqual(task);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: {
          ownerId: mockOwnerId,
          _id: new ObjectId(taskId),
          isDeleted: {
            $ne: true,
          },
        },
      });
    });
    it('should throw an error when message pushing task is not found', async () => {
      const taskId = '65afc62904d5db18534c0f78';
      jest.spyOn(repository, 'findOne').mockResolvedValue(null); // 模拟未找到任务
      const mockOwnerId = '66028642292c50f8b71a9eee';

      await expect(service.findOne({ id: taskId, ownerId: mockOwnerId }));
    });
  });

  describe('update', () => {
    it('should update a message pushing task', async () => {
      const taskId = '65afc62904d5db18534c0f78';
      const updateDto: UpdateMessagePushingTaskDto = {
        name: 'Updated Task',
        type: MESSAGE_PUSHING_TYPE.HTTP,
        pushAddress: 'http://update.example.com',
        triggerHook: MESSAGE_PUSHING_HOOK.RESPONSE_INSERTED,
        surveys: ['new survey id'],
      };
      const existingTask = new MessagePushingTask();
      existingTask._id = new ObjectId(taskId);
      existingTask.name = 'Original Task';
      const updatedTask = Object.assign({}, existingTask, updateDto);
      const mockOwnerId = '66028642292c50f8b71a9eee';

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingTask);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedTask);

      const result = await service.update({
        ownerId: mockOwnerId,
        id: taskId,
        updateData: updateDto,
      });

      expect(result).toEqual(updatedTask);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: {
          ownerId: mockOwnerId,
          _id: new ObjectId(taskId),
        },
      });
      expect(repository.save).toHaveBeenCalledWith(updatedTask);
    });
    it('should throw an error if the task to be updated is not found', async () => {
      const taskId = '65afc62904d5db18534c0f78';
      const updateDto: UpdateMessagePushingTaskDto = { name: 'Updated Task' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(null); // 模拟任务未找到
      const mockOwnerId = '66028642292c50f8b71a9eee';

      await expect(
        service.update({
          ownerId: mockOwnerId,
          id: taskId,
          updateData: updateDto,
        }),
      ).rejects.toThrow(`Message pushing task with id ${taskId} not found`);
    });
  });

  describe('remove', () => {
    it('should remove a message pushing task', async () => {
      const taskId = '65afc62904d5db18534c0f78';

      const updateResult = { modifiedCount: 1 };
      const mockOperatorId = '66028642292c50f8b71a9eee';
      const mockOperator = 'mockOperator';

      jest.spyOn(repository, 'updateOne').mockResolvedValue(updateResult);

      const result = await service.remove({
        id: taskId,
        operatorId: mockOperatorId,
        operator: mockOperator,
      });

      expect(result).toEqual(updateResult);
      expect(repository.updateOne).toHaveBeenCalledWith(
        {
          _id: new ObjectId(taskId),
        },
        {
          $set: {
            isDeleted: true,
            operatorId: mockOperatorId,
            operator: mockOperator,
            deletedAt: expect.any(Date),
          },
        },
      );
    });
    it('should throw an error if the task to be removed is not found', async () => {
      const taskId = '65afc62904d5db18534c0f78';
      jest
        .spyOn(repository, 'updateOne')
        .mockResolvedValue({ modifiedCount: 0 }); // 模拟删除失败
      const mockOperatorId = '66028642292c50f8b71a9eee';
      const mockOperator = 'mockOperator';

      const result = await service.remove({
        id: taskId,
        operatorId: mockOperatorId,
        operator: mockOperator,
      });

      expect(result.modifiedCount).toBe(0);
      expect(repository.updateOne).toHaveBeenCalledWith(
        {
          _id: new ObjectId(taskId),
        },
        expect.any(Object),
      );
    });
  });

  describe('surveyAuthorizeTask', () => {
    it('should authorize a survey for a task', async () => {
      const taskId = '65afc62904d5db18534c0f78';
      const surveyId = '65af380475b64545e5277dd9';
      const mockOwnerId = '66028642292c50f8b71a9eee';

      const updateResult = { modifiedCount: 1 };

      jest.spyOn(repository, 'updateOne').mockResolvedValue(updateResult);

      const result = await service.surveyAuthorizeTask({
        taskId,
        surveyId,
        ownerId: mockOwnerId,
      });

      expect(result).toEqual(updateResult);
      expect(repository.updateOne).toHaveBeenCalledWith(
        {
          ownerId: mockOwnerId,
          _id: new ObjectId(taskId),
          surveys: { $nin: [surveyId] },
        },
        {
          $push: {
            surveys: surveyId,
          },
          $set: {
            updatedAt: expect.any(Date),
          },
        },
      );
    });
    it('should not add the surveyId if it already exists in the task', async () => {
      const taskId = '65afc62904d5db18534c0f78';
      const surveyId = '65af380475b64545e5277dd9';
      const mockOwnerId = '66028642292c50f8b71a9eee';

      jest
        .spyOn(repository, 'updateOne')
        .mockResolvedValue({ modifiedCount: 0 }); // 模拟重复添加
      const result = await service.surveyAuthorizeTask({
        taskId,
        surveyId,
        ownerId: mockOwnerId,
      });

      expect(result.modifiedCount).toBe(0);
      expect(repository.updateOne).toHaveBeenCalledWith(
        {
          _id: new ObjectId(taskId),
          surveys: { $nin: [surveyId] }, // 确保只有不包含时才插入
          ownerId: mockOwnerId,
        },
        expect.any(Object),
      );
    });
  });
});
