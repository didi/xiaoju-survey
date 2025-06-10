import { Test, TestingModule } from '@nestjs/testing';
import { SurveyMetaService } from '../services/surveyMeta.service';
import { MongoRepository } from 'typeorm';
import { SurveyMeta } from 'src/models/surveyMeta.entity';
import { PluginManager } from 'src/securityPlugin/pluginManager';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from 'src/exceptions/httpException';
import { RECORD_STATUS, RECORD_SUB_STATUS } from 'src/enums';
import { ObjectId } from 'mongodb';

describe('SurveyMetaService', () => {
  let service: SurveyMetaService;
  let surveyRepository: MongoRepository<SurveyMeta>;
  let pluginManager: PluginManager;

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
            updateOne: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
        PluginManager,
      ],
    }).compile();

    service = module.get<SurveyMetaService>(SurveyMetaService);
    surveyRepository = module.get<MongoRepository<SurveyMeta>>(
      getRepositoryToken(SurveyMeta),
    );
    pluginManager = module.get<PluginManager>(PluginManager);
  });

  describe('getNewSurveyPath', () => {
    it('should generate a new survey path', async () => {
      jest.spyOn(pluginManager, 'triggerHook').mockResolvedValueOnce('path1');
      jest.spyOn(surveyRepository, 'count').mockResolvedValueOnce(0);

      const surveyPath = await service.getNewSurveyPath();

      expect(surveyPath).toBe('path1');
      expect(pluginManager.triggerHook).toHaveBeenCalledTimes(1);
      expect(surveyRepository.count).toHaveBeenCalledTimes(1);
    });
  });

  describe('createSurveyMeta', () => {
    it('should create a new survey meta and return it', async () => {
      const params = {
        title: 'Test Survey',
        remark: 'This is a test survey',
        surveyType: 'normal',
        username: 'testUser',
        userId: new ObjectId().toString(),
        createMethod: '',
        createFrom: '',
        workspaceId: 'workspace1',
      };
      const newSurvey = new SurveyMeta();

      jest.spyOn(service, 'getNewSurveyPath').mockResolvedValue('path1');
      jest
        .spyOn(surveyRepository, 'create')
        .mockImplementation(() => newSurvey);
      jest.spyOn(surveyRepository, 'save').mockResolvedValue(newSurvey);

      const result = await service.createSurveyMeta(params);

      expect(surveyRepository.create).toHaveBeenCalledWith({
        title: params.title,
        remark: params.remark,
        surveyType: params.surveyType,
        surveyPath: 'path1',
        creator: params.username,
        creatorId: params.userId,
        owner: params.username,
        ownerId: params.userId,
        createMethod: params.createMethod,
        createFrom: params.createFrom,
        workspaceId: params.workspaceId,
        groupId: null,
      });
      expect(surveyRepository.save).toHaveBeenCalledWith(newSurvey);
      expect(result).toEqual(newSurvey);
    });
  });

  describe('pausingSurveyMeta', () => {
    it('should throw an exception if survey is in NEW status', async () => {
      const survey = new SurveyMeta();
      survey.curStatus = { status: RECORD_STATUS.NEW, date: Date.now() };

      await expect(service.pausingSurveyMeta(survey)).rejects.toThrow(
        HttpException,
      );
    });

    it('should pause a survey and update subStatus', async () => {
      const survey = new SurveyMeta();
      survey.curStatus = { status: RECORD_STATUS.PUBLISHED, date: Date.now() };
      survey.statusList = [];

      jest.spyOn(surveyRepository, 'save').mockResolvedValue(survey);

      const result = await service.pausingSurveyMeta(survey);

      expect(survey.subStatus.status).toBe(RECORD_SUB_STATUS.PAUSING);
      expect(survey.statusList.length).toBe(1);
      expect(survey.statusList[0].status).toBe(RECORD_SUB_STATUS.PAUSING);
      expect(surveyRepository.save).toHaveBeenCalledWith(survey);
      expect(result).toEqual(survey);
    });
  });

  describe('editSurveyMeta', () => {
    it('should edit a survey meta and return it', async () => {
      const survey = new SurveyMeta();
      survey.curStatus = { status: RECORD_STATUS.PUBLISHED, date: Date.now() };
      survey.statusList = [];

      const operator = 'editor';
      const operatorId = 'editorId';

      jest.spyOn(surveyRepository, 'save').mockResolvedValue(survey);

      const result = await service.editSurveyMeta({
        survey,
        operator,
        operatorId,
      });

      expect(survey.curStatus.status).toBe(RECORD_STATUS.EDITING);
      expect(survey.statusList.length).toBe(1);
      expect(survey.statusList[0].status).toBe(RECORD_STATUS.EDITING);
      expect(survey.operator).toBe(operator);
      expect(survey.operatorId).toBe(operatorId);
      expect(surveyRepository.save).toHaveBeenCalledWith(survey);
      expect(result).toEqual(survey);
    });
  });

  describe('deleteSurveyMeta', () => {
    it('should mark a survey as deleted', async () => {
      const surveyId = new ObjectId().toString();
      const operator = 'deleter';
      const operatorId = 'deleterId';

      jest.spyOn(surveyRepository, 'updateOne').mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
        acknowledged: true,
      });

      const result = await service.deleteSurveyMeta({
        surveyId,
        operator,
        operatorId,
      });

      expect(surveyRepository.updateOne).toHaveBeenCalledWith(
        { _id: new ObjectId(surveyId) },
        {
          $set: {
            isDeleted: true,
            operator,
            operatorId,
            deletedAt: expect.any(Date),
          },
        },
      );
      expect(result.matchedCount).toBe(1);
    });
  });

  describe('getSurveyMetaList', () => {
    it('should return a list of survey metadata', async () => {
      const mockData = [
        { _id: 1, title: 'Survey 1' },
      ] as unknown as Array<SurveyMeta>;
      const mockCount = 1;

      jest
        .spyOn(surveyRepository, 'findAndCount')
        .mockResolvedValue([mockData, mockCount]);

      const condition = {
        pageNum: 1,
        pageSize: 10,
        userId: 'testUserId',
        username: 'testUser',
        filter: {},
        order: {},
      };

      const result = await service.getSurveyMetaList(condition);

      expect(result).toEqual({ data: mockData, count: mockCount });
      expect(surveyRepository.findAndCount).toHaveBeenCalledTimes(1);
    });
  });

  describe('publishSurveyMeta', () => {
    it('should publish a survey and update curStatus', async () => {
      const surveyMeta = new SurveyMeta();
      surveyMeta.statusList = [];

      jest.spyOn(surveyRepository, 'save').mockResolvedValue(surveyMeta);

      const result = await service.publishSurveyMeta({ surveyMeta });

      expect(surveyMeta.curStatus.status).toBe(RECORD_STATUS.PUBLISHED);
      expect(surveyMeta.statusList.length).toBe(1);
      expect(surveyMeta.statusList[0].status).toBe(RECORD_STATUS.PUBLISHED);
      expect(surveyRepository.save).toHaveBeenCalledWith(surveyMeta);
      expect(result).toEqual(surveyMeta);
    });
  });

  describe('countSurveyMetaByWorkspaceId', () => {
    it('should return the count of surveys in a workspace', async () => {
      const workspaceId = 'workspace1';
      const mockCount = 5;

      jest.spyOn(surveyRepository, 'count').mockResolvedValue(mockCount);

      const result = await service.countSurveyMetaByWorkspaceId({
        workspaceId,
      });

      expect(result).toBe(mockCount);
      expect(surveyRepository.count).toHaveBeenCalledWith({
        workspaceId,
        isDeleted: { $ne: true },
      });
    });
  });
  
  describe('restoreSurveyMeta', () => {
    it('should restore a survey and update its status', async () => {
      const surveyId = new ObjectId().toString();
      const operator = 'restorer';
      const operatorId = 'restorerId';

      const mockUpdateResult = {
        matchedCount: 1,
        modifiedCount: 1,
        acknowledged: true,
      };

      jest.spyOn(surveyRepository, 'updateOne').mockResolvedValue(mockUpdateResult);

      const result = await service.restoreSurveyMeta({
        surveyId,
        operator,
        operatorId,
      });

      expect(surveyRepository.updateOne).toHaveBeenCalledWith(
        { _id: new ObjectId(surveyId) },
        {
          $set: {
            isDeleted: false,
            operator,
            operatorId,
            deletedAt: null,
            curStatus: {
              status: RECORD_STATUS.NEW,
              date: expect.any(Number),
            },
            subStatus: {
              status: RECORD_SUB_STATUS.DEFAULT,
              date: expect.any(Number),
            },
          },
        },
      );
      expect(result).toEqual(mockUpdateResult);
    });
  });

  describe('completelyDeleteSurveyMeta', () => {
    it('should completely delete a survey', async () => {
      const surveyId = new ObjectId().toString();
      const operator = 'deleter';
      const operatorId = 'deleterId';

      const mockUpdateResult = {
        matchedCount: 1,
        modifiedCount: 1,
        acknowledged: true,
      };

      jest.spyOn(surveyRepository, 'updateOne').mockResolvedValue(mockUpdateResult);

      const result = await service.completelyDeleteSurveyMeta({
        surveyId,
        operator,
        operatorId,
      });

      expect(surveyRepository.updateOne).toHaveBeenCalledWith(
        { _id: new ObjectId(surveyId) },
        {
          $set: {
            isDeleted: true,
            isCompletelyDeleted: true,
            operator,
            operatorId,
            deletedAt: expect.any(Date),
          },
        },
      );
      expect(result).toEqual(mockUpdateResult);
    });
  });
});
