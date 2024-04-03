import { Test, TestingModule } from '@nestjs/testing';
import { MessagePushingTaskService } from '../services/messagePushingTask.service';
import { MongoRepository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MessagePushingTask } from 'src/models/messagePushingTask.entity';
import { CreateMessagePushingTaskDto } from '../dto/createMessagePushingTask.dto';
import { UpdateMessagePushingTaskDto } from '../dto/updateMessagePushingTask.dto';
import { ObjectId } from 'mongodb';
import { RECORD_STATUS } from 'src/enums';
import { MESSAGE_PUSHING_TYPE } from 'src/enums/messagePushing';
import { MESSAGE_PUSHING_HOOK } from 'src/enums/messagePushing';

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
      savedTask.surveys = ['surveyId1', 'surveyId2'];

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
          ownerId: mockOwnerId,
          surveys: { $all: [surveyId] },
          triggerHook: hook,
          'curStatus.status': { $ne: RECORD_STATUS.REMOVED },
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
          'curStatus.status': { $ne: RECORD_STATUS.REMOVED },
        },
      });
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
        curStatus: {
          status: RECORD_STATUS.EDITING,
          date: Date.now(),
        },
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
  });

  describe('remove', () => {
    it('should remove a message pushing task', async () => {
      const taskId = '65afc62904d5db18534c0f78';

      const updateResult = { modifiedCount: 1 };
      const mockOwnerId = '66028642292c50f8b71a9eee';

      jest.spyOn(repository, 'updateOne').mockResolvedValue(updateResult);

      const result = await service.remove({
        id: taskId,
        ownerId: mockOwnerId,
      });

      expect(result).toEqual(updateResult);
      expect(repository.updateOne).toHaveBeenCalledWith(
        {
          ownerId: mockOwnerId,
          _id: new ObjectId(taskId),
          'curStatus.status': { $ne: RECORD_STATUS.REMOVED },
        },
        {
          $set: {
            curStatus: {
              status: RECORD_STATUS.REMOVED,
              date: expect.any(Number),
            },
          },
          $push: {
            statusList: {
              status: RECORD_STATUS.REMOVED,
              date: expect.any(Number),
            },
          },
        },
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
        },
      );
    });
  });
});
