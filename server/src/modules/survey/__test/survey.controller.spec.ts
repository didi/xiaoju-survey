import { Test, TestingModule } from '@nestjs/testing';
import { SurveyController } from '../controllers/survey.controller';
import { SurveyMetaService } from '../services/surveyMeta.service';
import { SurveyConfService } from '../services/surveyConf.service';
import { ResponseSchemaService } from '../../surveyResponse/services/responseScheme.service';
import { ContentSecurityService } from '../services/contentSecurity.service';
import { SurveyHistoryService } from '../services/surveyHistory.service';
import { SessionService } from '../services/session.service';
import { UserService } from '../../auth/services/user.service';
import { ObjectId } from 'mongodb';
import { Logger } from 'src/logger';
import { HttpException } from 'src/exceptions/httpException';
import { Authentication } from 'src/guards/authentication.guard';

jest.mock('../services/surveyMeta.service');
jest.mock('../services/surveyConf.service');
jest.mock('../../surveyResponse/services/responseScheme.service');
jest.mock('../services/contentSecurity.service');
jest.mock('../services/surveyHistory.service');
jest.mock('../services/session.service');
jest.mock('../../auth/services/user.service');
jest.mock('src/guards/authentication.guard');
jest.mock('src/guards/survey.guard');
jest.mock('src/guards/workspace.guard');

describe('SurveyController', () => {
  let controller: SurveyController;
  let surveyMetaService: SurveyMetaService;
  let surveyConfService: SurveyConfService;
  let responseSchemaService: ResponseSchemaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyController],
      providers: [
        SurveyMetaService,
        SurveyConfService,
        ResponseSchemaService,
        ContentSecurityService,
        SurveyHistoryService,
        SessionService,
        UserService,
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
            info: jest.fn(),
          },
        },
        {
          provide: Authentication,
          useClass: jest.fn().mockImplementation(() => ({
            canActivate: () => true,
          })),
        },
      ],
    }).compile();

    controller = module.get<SurveyController>(SurveyController);
    surveyMetaService = module.get<SurveyMetaService>(SurveyMetaService);
    surveyConfService = module.get<SurveyConfService>(SurveyConfService);
    responseSchemaService = module.get<ResponseSchemaService>(
      ResponseSchemaService,
    );
  });

  describe('getBannerData', () => {
    it('should return banner data', async () => {
      const result = await controller.getBannerData();
      expect(result.code).toBe(200);
      expect(result.data).toBeDefined();
    });
  });

  describe('createSurvey', () => {
    it('should create a survey and return the survey id', async () => {
      const surveyInfo = {
        surveyType: 'normal',
        remark: '问卷调研',
        title: '问卷调研',
      };

      const newId = new ObjectId();
      jest.spyOn(surveyMetaService, 'createSurveyMeta').mockResolvedValue({
        _id: newId,
      } as any);

      jest.spyOn(surveyConfService, 'createSurveyConf').mockResolvedValue({
        _id: new ObjectId(),
      } as any);

      const result = await controller.createSurvey(surveyInfo, {
        user: { username: 'testUser', _id: new ObjectId() },
      });

      expect(result).toEqual({
        code: 200,
        data: {
          id: newId.toString(),
        },
      });
    });

    it('should throw an error if validation fails', async () => {
      const surveyInfo = {}; // Invalid data
      await expect(
        controller.createSurvey(surveyInfo as any, { user: {} }),
      ).rejects.toThrow(HttpException);
    });

    it('should create a new survey by copy', async () => {
      const existsSurveyId = new ObjectId();
      const params = {
        surveyType: 'normal',
        remark: '问卷调研',
        title: '问卷调研',
        createMethod: 'copy',
        createFrom: existsSurveyId.toString(),
      };

      const request = {
        user: { username: 'testUser', _id: new ObjectId() },
        surveyMeta: { _id: existsSurveyId, surveyType: 'exam' },
      };

      jest.spyOn(surveyMetaService, 'createSurveyMeta').mockResolvedValue({
        _id: new ObjectId(),
      } as any);

      const result = await controller.createSurvey(params, request);
      expect(result?.data?.id).toBeDefined();
    });
  });

  describe('updateConf', () => {
    it('should update survey configuration', async () => {
      const surveyId = new ObjectId();
      const reqBody = {
        surveyId: surveyId.toString(),
        configData: {
          /* ... your config data here ... */
        },
        sessionId: 'mock-session-id',
      };

      const result = await controller.updateConf(reqBody, {
        user: { username: 'testUser', _id: 'testUserId' },
        surveyMeta: { _id: surveyId },
      });

      expect(result).toEqual({
        code: 200,
      });
    });

    it('should throw an error if validation fails', async () => {
      const reqBody = {}; // Invalid data
      await expect(
        controller.updateConf(reqBody, { user: {} }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('deleteSurvey', () => {
    it('should delete a survey and its related data', async () => {
      const surveyId = new ObjectId();
      const surveyMeta = {
        _id: surveyId,
        surveyType: 'exam',
        owner: 'testUser',
      };

      jest
        .spyOn(surveyMetaService, 'deleteSurveyMeta')
        .mockResolvedValue(undefined);
      jest
        .spyOn(responseSchemaService, 'deleteResponseSchema')
        .mockResolvedValue(undefined);

      const result = await controller.deleteSurvey({
        surveyMeta,
        user: { username: 'testUser', _id: new ObjectId() },
      });
      expect(result).toEqual({ code: 200 });
    });
  });

  describe('getSurvey', () => {
    it('should return survey metadata and configuration', async () => {
      const surveyId = new ObjectId();
      const surveyMeta = {
        _id: surveyId,
        surveyType: 'exam',
        owner: 'testUser',
      };

      jest
        .spyOn(surveyConfService, 'getSurveyConfBySurveyId')
        .mockResolvedValue({} as any);
      const result = await controller.getSurvey(
        { surveyId: surveyId.toString() },
        {
          surveyMeta,
          user: { username: 'testUser', _id: new ObjectId() },
        },
      );

      expect(result?.data?.surveyMetaRes).toBeDefined();
      expect(result?.data?.surveyConfRes).toBeDefined();
    });
  });

  describe('publishSurvey', () => {
    it('should publish a survey successfully', async () => {
      const surveyId = new ObjectId();
      const surveyMeta = {
        _id: surveyId,
        surveyType: 'exam',
        owner: 'testUser',
        isDeleted: false,
      };

      jest
        .spyOn(surveyConfService, 'getSurveyConfBySurveyId')
        .mockResolvedValue({
          code: {},
        } as any);

      jest
        .spyOn(surveyConfService, 'getSurveyContentByCode')
        .mockResolvedValue({ text: '' });
      jest
        .spyOn(surveyMetaService, 'publishSurveyMeta')
        .mockResolvedValue(undefined);

      const result = await controller.publishSurvey(
        { surveyId: surveyId.toString() },
        { surveyMeta, user: { username: 'testUser', _id: new ObjectId() } },
      );
      expect(result.code).toBe(200);
    });

    it('should throw an error if the survey is deleted', async () => {
      const surveyId = new ObjectId();
      const surveyMeta = { _id: surveyId, isDeleted: true };

      await expect(
        controller.publishSurvey(
          { surveyId: surveyId.toString() },
          { surveyMeta, user: { username: 'testUser' } },
        ),
      ).rejects.toThrow(HttpException);
    });
  });

  // New tests for additional methods
  describe('pausingSurvey', () => {
    it('should pause the survey successfully', async () => {
      const surveyMeta = { surveyPath: 'some/path' };

      jest
        .spyOn(surveyMetaService, 'pausingSurveyMeta')
        .mockResolvedValue(undefined);
      jest
        .spyOn(responseSchemaService, 'pausingResponseSchema')
        .mockResolvedValue(undefined);

      const result = await controller.pausingSurvey({
        surveyMeta,
        user: { username: 'testUser' },
      });
      expect(result.code).toBe(200);
    });
  });

  describe('getPreviewSchema', () => {
    it('should get the preview schema successfully', async () => {
      const surveyId = new ObjectId();
      jest
        .spyOn(surveyConfService, 'getSurveyConfBySurveyId')
        .mockResolvedValue({} as any);
      jest.spyOn(surveyMetaService, 'getSurveyById').mockResolvedValue({
        title: 'Test Survey',
        surveyPath: 'some/path',
      } as any);

      const result = await controller.getPreviewSchema({
        surveyPath: surveyId.toString(),
      });
      expect(result.code).toBe(200);
    });
  });
});
