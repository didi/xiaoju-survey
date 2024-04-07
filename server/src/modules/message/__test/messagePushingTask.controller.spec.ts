import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MessagePushingTaskController } from '../controllers/messagePushingTask.controller';
import { MessagePushingTaskService } from '../services/messagePushingTask.service';
import { CreateMessagePushingTaskDto } from '../dto/createMessagePushingTask.dto';
import { QueryMessagePushingTaskListDto } from '../dto/queryMessagePushingTaskList.dto';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import {
  MESSAGE_PUSHING_HOOK,
  MESSAGE_PUSHING_TYPE,
} from 'src/enums/messagePushing';
import { MessagePushingTask } from 'src/models/messagePushingTask.entity';
import { Authtication } from 'src/guards/authtication';
import { UserService } from 'src/modules/auth/services/user.service';

import { UpdateMessagePushingTaskDto } from '../dto/updateMessagePushingTask.dto';
import { ObjectId } from 'mongodb';

describe('MessagePushingTaskController', () => {
  let controller: MessagePushingTaskController;
  let service: MessagePushingTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagePushingTaskController],
      providers: [
        ConfigService,
        {
          provide: MessagePushingTaskService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            surveyAuthorizeTask: jest.fn(),
          },
        },
        {
          provide: Authtication,
          useClass: jest.fn().mockImplementation(() => ({
            canActivate: () => true,
          })),
        },
        {
          provide: UserService,
          useClass: jest.fn().mockImplementation(() => ({
            getUserByUsername() {
              return {};
            },
          })),
        },
      ],
    }).compile();

    controller = module.get<MessagePushingTaskController>(
      MessagePushingTaskController,
    );
    service = module.get<MessagePushingTaskService>(MessagePushingTaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a message pushing task', async () => {
      const createDto: CreateMessagePushingTaskDto = {
        name: 'test name',
        type: MESSAGE_PUSHING_TYPE.HTTP,
        pushAddress: 'http://example.com',
        triggerHook: MESSAGE_PUSHING_HOOK.RESPONSE_INSERTED,
        surveys: [],
      };
      const req = {
        user: {
          _id: '66028642292c50f8b71a9eee',
        },
      };
      const mockTask = {
        _id: new ObjectId(),
        name: 'test name',
        type: MESSAGE_PUSHING_TYPE.HTTP,
        pushAddress: 'http://example.com',
        triggerHook: MESSAGE_PUSHING_HOOK.RESPONSE_INSERTED,
        surveys: [],
      } as MessagePushingTask;
      jest.spyOn(service, 'create').mockResolvedValueOnce(mockTask);

      const result = await controller.create(req, createDto);
      expect(service.create).toHaveBeenCalledWith({
        ...createDto,
        ownerId: req.user._id,
      });
      expect(result).toEqual({
        code: 200,
        data: { taskId: mockTask._id.toString() },
      });
    });
  });

  describe('findAll', () => {
    it('should find all message pushing tasks by surveyId and triggerHook', async () => {
      const queryDto: QueryMessagePushingTaskListDto = {
        surveyId: '65f29f3192862d6a9067ad1c',
        triggerHook: MESSAGE_PUSHING_HOOK.RESPONSE_INSERTED,
      };
      const mockList = [];
      const req = {
        user: {
          _id: '66028642292c50f8b71a9eee',
        },
      };
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(mockList);

      const result = await controller.findAll(req, queryDto);
      expect(service.findAll).toHaveBeenCalledWith({
        surveyId: queryDto.surveyId,
        hook: queryDto.triggerHook,
        ownerId: req.user._id,
      });
      expect(result).toEqual({ code: 200, data: mockList });
    });

    it('should throw HttpException if surveyId or triggerHook is missing', async () => {
      const queryDto = {
        surveyId: '',
        triggerHook: '',
      };

      const req = {
        user: {
          _id: '',
        },
      };

      await expect(
        controller.findAll(req, queryDto as QueryMessagePushingTaskListDto),
      ).rejects.toThrow(
        new HttpException('参数错误', EXCEPTION_CODE.PARAMETER_ERROR),
      );
      expect(service.findAll).toHaveBeenCalledTimes(0);
    });
  });

  describe('findOne', () => {
    it('should find one message pushing task by ID', async () => {
      const req = {
        user: {
          _id: '66028642292c50f8b71a9eee',
        },
      };
      const mockTask = {} as MessagePushingTask; // create mock data for your test
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockTask);
      const mockTaskId = '65afc62904d5db18534c0f78';
      const result = await controller.findOne(req, mockTaskId);
      expect(service.findOne).toHaveBeenCalledWith({
        ownerId: req.user._id,
        id: mockTaskId,
      });
      expect(result).toEqual({ code: 200, data: mockTask });
    });
  });

  describe('update', () => {
    it('should update a message pushing task by ID', async () => {
      const updateDto: UpdateMessagePushingTaskDto = {
        triggerHook: MESSAGE_PUSHING_HOOK.RESPONSE_INSERTED,
      };
      const mockTask = {}; // create mock data for your test
      jest
        .spyOn(service, 'update')
        .mockResolvedValueOnce(mockTask as MessagePushingTask);
      const mockTaskId = '65afc62904d5db18534c0f78';
      const req = {
        user: {
          _id: '66028642292c50f8b71a9eee',
        },
      };
      const result = await controller.update(req, mockTaskId, updateDto);
      expect(service.update).toHaveBeenCalledWith({
        id: mockTaskId,
        ownerId: req.user._id,
        updateData: updateDto,
      });
      expect(result).toEqual({ code: 200, data: mockTask });
    });
  });

  describe('remove', () => {
    it('should remove a message pushing task by ID', async () => {
      const mockResponse = { modifiedCount: 1 };
      const req = {
        user: {
          _id: '66028642292c50f8b71a9eee',
        },
      };
      const mockTaskId = '65afc62904d5db18534c0f78';
      jest.spyOn(service, 'remove').mockResolvedValueOnce(mockResponse);

      const result = await controller.remove(req, mockTaskId);
      expect(result).toEqual({ code: 200, data: true });
    });
  });

  describe('surveyAuthorizeTask', () => {
    it('should authorize a survey for a task', async () => {
      const mockResponse = { modifiedCount: 1 };
      const req = {
        user: {
          _id: '66028642292c50f8b71a9eee',
        },
      };
      jest
        .spyOn(service, 'surveyAuthorizeTask')
        .mockResolvedValueOnce(mockResponse);
      const mockTaskId = '65afc62904d5db18534c0f78';
      const mockSurveyId = '65f29f3192862d6a9067ad1c';
      const result = await controller.surveyAuthorizeTask(
        req,
        mockTaskId,
        mockSurveyId,
      );
      expect(result).toEqual({ code: 200, data: true });
    });
  });
});
