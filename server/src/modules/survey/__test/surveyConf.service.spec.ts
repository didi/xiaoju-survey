import { Test, TestingModule } from '@nestjs/testing';
import { MongoRepository } from 'typeorm';
import { SurveyConf } from 'src/models/surveyConf.entity';
import { SurveyConfService } from '../services/surveyConf.service';
import { SurveyNotFoundException } from 'src/exceptions/surveyNotFoundException';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SurveySchemaInterface } from 'src/interfaces/survey';

describe('SurveyConfService', () => {
  let service: SurveyConfService;
  let surveyConfRepository: MongoRepository<SurveyConf>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyConfService,
        {
          provide: getRepositoryToken(SurveyConf),
          useValue: {
            findOne: jest.fn().mockResolvedValue(null),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SurveyConfService>(SurveyConfService);
    surveyConfRepository = module.get<MongoRepository<SurveyConf>>(
      getRepositoryToken(SurveyConf),
    );
  });

  it('should create survey configuration successfully', async () => {
    const mockSchemaData = {};
    jest.mock('../utils', () => ({
      getSchemaBySurveyType: jest.fn().mockResolvedValue(mockSchemaData),
    }));

    surveyConfRepository.create = jest
      .fn()
      .mockReturnValue({ pageId: 'testId', code: mockSchemaData });
    surveyConfRepository.save = jest
      .fn()
      .mockResolvedValue({ id: 1, pageId: 'testId', code: mockSchemaData });

    const result = await service.createSurveyConf({
      surveyId: 'testId',
      surveyType: 'normal',
      createMethod: '',
      createFrom: '',
    });

    expect(result).toEqual({ id: 1, pageId: 'testId', code: mockSchemaData });
    expect(surveyConfRepository.findOne).not.toHaveBeenCalled();
    expect(surveyConfRepository.create).toHaveBeenCalledTimes(1);
    expect(surveyConfRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should throw SurveyNotFoundException when survey config not found', async () => {
    try {
      await service.getSurveyConfBySurveyId('nonExistingId');
    } catch (error) {
      expect(error).toBeInstanceOf(SurveyNotFoundException);
      expect(error.message).toBe('问卷配置不存在');
    }

    expect(surveyConfRepository.findOne).toHaveBeenCalledWith({
      where: { pageId: 'nonExistingId' },
    });
  });

  it('should save survey configuration', async () => {
    // 准备参数和模拟数据
    const surveyId = 'someSurveyId';
    const schema = {
      dataConf: {
        dataList: [],
      },
      bannerConf: {},
      submitConf: {},
      baseConf: {},
      skinConf: {},
    } as SurveySchemaInterface;

    jest.spyOn(surveyConfRepository, 'findOne').mockResolvedValue({
      surveyId: surveyId,
      code: schema,
    } as unknown as SurveyConf);

    await service.saveSurveyConf({ surveyId, schema });

    // 验证save方法被调用了一次，并且传入了正确的参数
    expect(surveyConfRepository.save).toHaveBeenCalledTimes(1);
    expect(surveyConfRepository.save).toHaveBeenCalledWith({
      surveyId: surveyId,
      code: schema,
    });
  });

  it('should throw when saving survey configuration with non-existing surveyId', async () => {
    // 准备参数
    const surveyId = 'nonExistingSurveyId';
    const schema = {
      dataConf: {
        dataList: [],
      },
      bannerConf: {},
      submitConf: {},
      baseConf: {},
      skinConf: {},
    } as SurveySchemaInterface;

    // 调用待测试的方法并期待抛出异常
    await expect(service.saveSurveyConf({ surveyId, schema })).rejects.toThrow(
      SurveyNotFoundException,
    );

    // 验证save方法没有被调用，因为没有找到对应的surveyId
    expect(surveyConfRepository.save).not.toHaveBeenCalled();
  });

  it('should get survey content by code', async () => {
    // 准备参数和模拟数据
    const schema = {
      dataConf: {
        dataList: [
          {
            title: 'Title1',
            options: [{ text: 'Option1' }, { text: 'Option2' }],
          },
          {
            title: 'Title2',
          },
        ],
      },
      bannerConf: {},
      submitConf: {},
      baseConf: {},
      skinConf: {},
    } as SurveySchemaInterface;

    // 调用待测试的方法
    const result = await service.getSurveyContentByCode(schema);

    // 验证返回结果是否正确
    expect(result).toEqual({
      text: 'Title1\nOption1\nOption2\nTitle2',
    });
  });
});
