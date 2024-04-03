import { Test, TestingModule } from '@nestjs/testing';
import { MessagePushingLogService } from '../services/messagePushingLog.service';
import { MongoRepository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MessagePushingLog } from 'src/models/messagePushingLog.entity';
import { ObjectId } from 'mongodb';

describe('MessagePushingLogService', () => {
  let service: MessagePushingLogService;
  let repository: MongoRepository<MessagePushingLog>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagePushingLogService,
        {
          provide: getRepositoryToken(MessagePushingLog),
          useClass: MongoRepository,
        },
      ],
    }).compile();

    service = module.get<MessagePushingLogService>(MessagePushingLogService);
    repository = module.get<MongoRepository<MessagePushingLog>>(
      getRepositoryToken(MessagePushingLog),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPushingLog', () => {
    it('should create a message pushing log', async () => {
      const taskId = '65afc62904d5db18534c0f78';
      const request = { reqKey: 'value' };
      const response = { resKey: 'value' };
      const status = 200;

      const createdLog = new MessagePushingLog();
      createdLog.taskId = taskId;
      createdLog.request = request;
      createdLog.response = response;
      createdLog.status = status;

      jest.spyOn(repository, 'create').mockReturnValue(createdLog);
      jest.spyOn(repository, 'save').mockResolvedValue(createdLog);

      const result = await service.createPushingLog({
        taskId,
        request,
        response,
        status,
      });

      expect(result).toEqual(createdLog);
      expect(repository.create).toHaveBeenCalledWith({
        taskId,
        request,
        response,
        status,
      });
      expect(repository.save).toHaveBeenCalledWith(createdLog);
    });
  });

  describe('findAllByTaskId', () => {
    it('should find all message pushing logs by task id', async () => {
      const taskId = '65afc62904d5db18534c0f78';
      const logs = [{ taskId, request: {}, response: {}, status: 200 }];

      jest
        .spyOn(repository, 'find')
        .mockResolvedValue(logs as MessagePushingLog[]);

      const result = await service.findAllByTaskId(taskId);

      expect(result).toEqual(logs);
      expect(repository.find).toHaveBeenCalledWith({ where: { taskId } });
    });
  });

  describe('findOne', () => {
    it('should find one message pushing log by id', async () => {
      const logId = '65af380475b64545e5277dd9';
      const log = {
        _id: new ObjectId(logId),
        taskId: '65afc62904d5db18534c0f78',
        request: {},
        response: {},
        status: 200,
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(log as MessagePushingLog);

      const result = await service.findOne(logId);

      expect(result).toEqual(log);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { _id: new ObjectId(logId) },
      });
    });
  });
});
