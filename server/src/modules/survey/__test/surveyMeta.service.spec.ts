import { Test, TestingModule } from '@nestjs/testing';
import { SurveyMetaService } from '../services/surveyMeta.service';
import { MongoRepository } from 'typeorm';
import { SurveyMeta } from 'src/models/surveyMeta.entity';
import { ObjectId } from 'mongodb';
import { PluginManagerProvider } from 'src/securityPlugin/pluginManager.provider';
import { XiaojuSurveyPluginManager } from 'src/securityPlugin/pluginManager';
import { SurveyNotFoundException } from 'src/exceptions/surveyNotFoundException';
import { NoSurveyPermissionException } from 'src/exceptions/noSurveyPermissionException';
import { RECORD_STATUS } from 'src/enums';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from 'src/exceptions/httpException';
import { SurveyUtilPlugin } from 'src/securityPlugin/surveyUtilPlugin';

describe('SurveyMetaService', () => {
  let service: SurveyMetaService;
  let surveyRepository: MongoRepository<SurveyMeta>;
  let pluginManager: XiaojuSurveyPluginManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyMetaService,
        {
          provide: getRepositoryToken(SurveyMeta),
          useValue: {
            findOne: jest.fn(),
            count: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
        PluginManagerProvider,
      ],
    }).compile();

    service = module.get<SurveyMetaService>(SurveyMetaService);
    surveyRepository = module.get<MongoRepository<SurveyMeta>>(
      getRepositoryToken(SurveyMeta),
    );
    pluginManager = module.get<XiaojuSurveyPluginManager>(
      XiaojuSurveyPluginManager,
    );
    pluginManager.registerPlugin(new SurveyUtilPlugin());
  });

  describe('getNewSurveyPath', () => {
    it('should generate a new survey path', async () => {
      jest.spyOn(surveyRepository, 'count').mockResolvedValueOnce(1);
      jest.spyOn(surveyRepository, 'count').mockResolvedValueOnce(0);

      const surveyPath = await service.getNewSurveyPath();

      expect(typeof surveyPath).toBe('string');
      expect(surveyRepository.count).toHaveBeenCalledTimes(2);
    });
  });

  describe('checkSurveyAccess', () => {
    it('should return survey when user has access', async () => {
      const surveyId = new ObjectId().toHexString();
      const username = 'testUser';
      const survey = { owner: username } as SurveyMeta;
      jest.spyOn(surveyRepository, 'findOne').mockResolvedValue(survey);

      const result = await service.checkSurveyAccess({ surveyId, username });

      expect(result).toBe(survey);
      expect(surveyRepository.findOne).toHaveBeenCalledWith({
        where: { _id: new ObjectId(surveyId) },
      });
    });

    it('should throw SurveyNotFoundException when survey not found', async () => {
      const surveyId = new ObjectId().toHexString();
      const username = 'testUser';
      jest.spyOn(surveyRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.checkSurveyAccess({ surveyId, username }),
      ).rejects.toThrow(SurveyNotFoundException);

      expect(surveyRepository.findOne).toHaveBeenCalledWith({
        where: { _id: new ObjectId(surveyId) },
      });
    });

    it('should throw NoSurveyPermissionException when user has no access', async () => {
      const surveyId = new ObjectId().toHexString();
      const username = 'testUser';
      const surveyOwner = 'otherUser';
      const survey = { owner: surveyOwner } as SurveyMeta;
      jest.spyOn(surveyRepository, 'findOne').mockResolvedValue(survey);

      await expect(
        service.checkSurveyAccess({ surveyId, username }),
      ).rejects.toThrow(NoSurveyPermissionException);

      expect(surveyRepository.findOne).toHaveBeenCalledWith({
        where: { _id: new ObjectId(surveyId) },
      });
    });
  });

  describe('createSurveyMeta', () => {
    it('should create a new survey meta and return it', async () => {
      const params = {
        title: 'Test Survey',
        remark: 'This is a test survey',
        surveyType: 'normal',
        username: 'testUser',
        createMethod: '',
        createFrom: '',
      };
      const newSurvey = new SurveyMeta();

      const mockedSurveyPath = 'mockedSurveyPath';
      jest
        .spyOn(service, 'getNewSurveyPath')
        .mockResolvedValue(mockedSurveyPath);

      jest
        .spyOn(surveyRepository, 'create')
        .mockImplementation(() => newSurvey);
      jest.spyOn(surveyRepository, 'save').mockResolvedValue(newSurvey);

      const result = await service.createSurveyMeta(params);

      expect(surveyRepository.create).toHaveBeenCalledWith({
        title: params.title,
        remark: params.remark,
        surveyType: params.surveyType,
        surveyPath: mockedSurveyPath,
        creator: params.username,
        owner: params.username,
        createMethod: params.createMethod,
        createFrom: params.createFrom,
      });
      expect(surveyRepository.save).toHaveBeenCalledWith(newSurvey);
      expect(result).toEqual(newSurvey);
    });
  });

  describe('editSurveyMeta', () => {
    it('should edit a survey meta and return it if in NEW or EDITING status', async () => {
      const survey = new SurveyMeta();
      survey.curStatus = { status: RECORD_STATUS.PUBLISHED, date: Date.now() };
      survey.statusList = [];
      jest.spyOn(surveyRepository, 'save').mockResolvedValue(survey);

      const result = await service.editSurveyMeta(survey);

      expect(survey.curStatus.status).toEqual(RECORD_STATUS.EDITING);
      expect(survey.statusList.length).toBe(1);
      expect(survey.statusList[0].status).toEqual(RECORD_STATUS.EDITING);
      expect(surveyRepository.save).toHaveBeenCalledWith(survey);
      expect(result).toEqual(survey);
    });
  });

  describe('deleteSurveyMeta', () => {
    it('should delete survey meta and update status', async () => {
      // 准备假的SurveyMeta对象
      const survey = new SurveyMeta();
      survey.curStatus = { status: RECORD_STATUS.NEW, date: Date.now() };
      survey.statusList = [];

      // 模拟save方法
      jest.spyOn(surveyRepository, 'save').mockResolvedValue(survey);

      // 调用要测试的方法
      const result = await service.deleteSurveyMeta(survey);

      // 验证结果
      expect(result).toBe(survey);
      expect(survey.curStatus.status).toBe(RECORD_STATUS.REMOVED);
      expect(survey.statusList.length).toBe(1);
      expect(survey.statusList[0].status).toBe(RECORD_STATUS.REMOVED);
      expect(surveyRepository.save).toHaveBeenCalledTimes(1);
      expect(surveyRepository.save).toHaveBeenCalledWith(survey);
    });

    it('should throw exception when survey is already removed', async () => {
      // 准备假的SurveyMeta对象，其状态已设置为REMOVED
      const survey = new SurveyMeta();
      survey.curStatus = { status: RECORD_STATUS.REMOVED, date: Date.now() };

      // 调用要测试的方法并期待异常
      await expect(service.deleteSurveyMeta(survey)).rejects.toThrow(
        HttpException,
      );

      // 验证save方法没有被调用
      expect(surveyRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('getSurveyMetaList', () => {
    it('should return a list of survey metadata', async () => {
      // 准备模拟数据
      const mockData = [
        { _id: 1, title: 'Survey 1' },
        { _id: 2, title: 'Survey 2' },
      ] as unknown as Array<SurveyMeta>;
      const mockCount = 2;

      jest
        .spyOn(surveyRepository, 'findAndCount')
        .mockResolvedValue([mockData, mockCount]);

      // 调用方法并检查返回值
      const condition = {
        pageNum: 1,
        pageSize: 10,
        username: 'testUser',
        filter: {},
        order: {},
      };
      const result = await service.getSurveyMetaList(condition);

      // 验证返回值
      expect(result).toEqual({ data: mockData, count: mockCount });
      // 验证repository方法被正确调用
      expect(surveyRepository.findAndCount).toHaveBeenCalledWith({
        where: {
          owner: 'testUser',
          'curStatus.status': { $ne: 'removed' },
        },
        skip: 0,
        take: 10,
        order: { createDate: -1 },
      });
    });
  });

  describe('publishSurveyMeta', () => {
    it('should publish a survey meta and add status to statusList', async () => {
      // 准备模拟数据
      const surveyMeta = {
        id: 1,
        title: 'Test Survey',
        statusList: [],
      } as unknown as SurveyMeta;
      const savedSurveyMeta = {
        ...surveyMeta,
        curStatus: {
          status: RECORD_STATUS.PUBLISHED,
          date: expect.any(Number),
        },
      } as unknown as SurveyMeta;

      jest.spyOn(surveyRepository, 'save').mockResolvedValue(savedSurveyMeta);

      // 调用方法并检查返回值
      const result = await service.publishSurveyMeta({ surveyMeta });

      // 验证返回值
      expect(result).toEqual(savedSurveyMeta);
      // 验证repository方法被正确调用
      expect(surveyRepository.save).toHaveBeenCalledWith(savedSurveyMeta);
    });
  });
});
