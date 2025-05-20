import { Test, TestingModule } from '@nestjs/testing';
import { CounterService } from '../services/counter.service';
import { MongoRepository } from 'typeorm';
import { Counter } from 'src/models/counter.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Logger } from 'src/logger';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';

describe('CounterService', () => {
  let service: CounterService;
  let counterRepository: MongoRepository<Counter>;
  let queryRunner: any;

  beforeEach(async () => {
    queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        findOne: jest.fn(),
        save: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CounterService,
        {
          provide: getRepositoryToken(Counter),
          useValue: {
            updateOne: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            manager: {
              connection: {
                createQueryRunner: () => queryRunner,
              },
            },
          },
        },
        {
          provide: Logger,
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CounterService>(CounterService);
    counterRepository = module.get<MongoRepository<Counter>>(
      getRepositoryToken(Counter),
    );
  });

  it('should update counter data', async () => {
    const data = { someData: 'someValue' };
    const updateResult = { rawResponse: { matchedCount: 1, modifiedCount: 1 } };
    jest.spyOn(counterRepository, 'updateOne').mockResolvedValue(updateResult);

    const result = await service.set({
      surveyPath: 'testPath',
      key: 'testKey',
      data,
      type: 'testType',
    });

    expect(result).toEqual(updateResult);
    expect(counterRepository.updateOne).toHaveBeenCalledWith(
      { key: 'testKey', surveyPath: 'testPath', type: 'testType' },
      {
        $set: {
          key: 'testKey',
          surveyPath: 'testPath',
          type: 'testType',
          data,
          updatedAt: expect.any(Date),
        },
      },
      { upsert: true },
    );
  });

  it('should get counter data', async () => {
    const expectedData = { someData: 'someValue' };
    const counterEntity = new Counter();
    counterEntity.data = expectedData;
    jest.spyOn(counterRepository, 'findOne').mockResolvedValue(counterEntity);

    const result = await service.get({
      surveyPath: 'testPath',
      key: 'testKey',
      type: 'testType',
    });

    expect(result).toEqual(expectedData);
    expect(counterRepository.findOne).toHaveBeenCalledWith({
      where: { key: 'testKey', surveyPath: 'testPath', type: 'testType' },
    });
  });

  it('should get all counter data', async () => {
    const expectedData = {
      key1: { someData: 'value1' },
      key2: { someData: 'value2' },
    };
    const counterEntities = [
      { key: 'key1', data: expectedData.key1 },
      { key: 'key2', data: expectedData.key2 },
    ] as unknown as Array<Counter>;
    jest.spyOn(counterRepository, 'find').mockResolvedValue(counterEntities);

    const result = await service.getAll({
      surveyPath: 'testPath',
      keyList: ['key1', 'key2'],
      type: 'testType',
    });

    expect(result).toEqual(expectedData);
    expect(counterRepository.find).toHaveBeenCalledWith({
      where: {
        key: { $in: ['key1', 'key2'] },
        surveyPath: 'testPath',
        type: 'testType',
      },
    });
  });

  it('should return null when counter data not found', async () => {
    jest.spyOn(counterRepository, 'findOne').mockResolvedValue(null);

    const result = await service.get({
      surveyPath: 'testPath',
      key: 'testKey',
      type: 'testType',
    });

    expect(result).toBeUndefined();
  });

  it('should return empty object when no counters found', async () => {
    jest.spyOn(counterRepository, 'find').mockResolvedValue([]);

    const result = await service.getAll({
      surveyPath: 'testPath',
      keyList: ['key1', 'key2'],
      type: 'testType',
    });

    expect(result).toEqual({});
  });

  describe('checkAndUpdateOptionCount', () => {
    it('should successfully update option count', async () => {
      const mockCounter = {
        _id: 'counterId',
        data: { 'option1-hash': 1, total: 1 },
      };
      queryRunner.manager.findOne.mockResolvedValue(mockCounter);

      await service.checkAndUpdateOptionCount({
        optionInfoWithId: {
          field1: [
            { hash: 'option1-hash', text: 'Option 1', title: 'Question 1' },
          ],
        },
        userAnswer: { field1: 'option1-hash' },
        surveyPath: 'testPath',
      });

      expect(queryRunner.manager.save).toHaveBeenCalledWith(
        Counter,
        expect.objectContaining({
          _id: 'counterId',
          key: 'field1',
          surveyPath: 'testPath',
          type: 'option',
          data: { 'option1-hash': 2, total: 2 },
        }),
      );
    });

    it('should throw error when option quota is exceeded', async () => {
      const mockCounter = {
        _id: 'counterId',
        data: { 'option1-hash': 5, total: 5 },
      };
      queryRunner.manager.findOne.mockResolvedValue(mockCounter);

      await expect(
        service.checkAndUpdateOptionCount({
          optionInfoWithId: {
            field1: [
              {
                hash: 'option1-hash',
                text: 'Option 1',
                title: 'Question 1',
                quota: 5,
              },
            ],
          },
          userAnswer: { field1: 'option1-hash' },
          surveyPath: 'testPath',
        }),
      ).rejects.toThrow(HttpException);

      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should throw error when option does not exist', async () => {
      await expect(
        service.checkAndUpdateOptionCount({
          optionInfoWithId: {
            field1: [
              { hash: 'option1-hash', text: 'Option 1', title: 'Question 1' },
            ],
          },
          userAnswer: { field1: 'non-existent-hash' },
          surveyPath: 'testPath',
        }),
      ).rejects.toThrow(
        new HttpException('选项不存在', EXCEPTION_CODE.PARAMETER_ERROR),
      );

      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should handle array of answers', async () => {
      const mockCounter = {
        _id: 'counterId',
        data: { 'option1-hash': 1, 'option2-hash': 1, total: 1 },
      };
      queryRunner.manager.findOne.mockResolvedValue(mockCounter);

      await service.checkAndUpdateOptionCount({
        optionInfoWithId: {
          field1: [
            { hash: 'option1-hash', text: 'Option 1', title: 'Question 1' },
            { hash: 'option2-hash', text: 'Option 2', title: 'Question 1' },
          ],
        },
        userAnswer: { field1: ['option1-hash', 'option2-hash'] },
        surveyPath: 'testPath',
      });

      expect(queryRunner.manager.save).toHaveBeenCalledWith(
        Counter,
        expect.objectContaining({
          data: { 'option1-hash': 2, 'option2-hash': 2, total: 2 },
        }),
      );
    });
  });
});
