import { Test, TestingModule } from '@nestjs/testing';
import { CounterService } from '../services/counter.service';
import { MongoRepository } from 'typeorm';
import { Counter } from 'src/models/counter.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CounterService', () => {
  let service: CounterService;
  let counterRepository: MongoRepository<Counter>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CounterService,
        {
          provide: getRepositoryToken(Counter),
          useValue: {
            updateOne: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
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
});
