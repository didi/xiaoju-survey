import { Test, TestingModule } from '@nestjs/testing';
import { SurveyController } from '../controllers/survey.controller';
import { SurveyMetaService } from '../services/surveyMeta.service';
import { SurveyConfService } from '../services/surveyConf.service';
import { ResponseSchemaService } from '../../surveyResponse/services/responseScheme.service';
import { ContentSecurityService } from '../services/contentSecurity.service';
import { SurveyHistoryService } from '../services/surveyHistory.service';
import { CounterService } from '../../surveyResponse/services/counter.service';
import { SessionService } from '../services/session.service';
import { UserService } from '../../auth/services/user.service';
import { ObjectId } from 'mongodb';
import { SurveyMeta } from 'src/models/surveyMeta.entity';
import { SurveyConf } from 'src/models/surveyConf.entity';
import { Logger } from 'src/logger';

jest.mock('../services/surveyMeta.service');
jest.mock('../services/surveyConf.service');
jest.mock('../../surveyResponse/services/responseScheme.service');
jest.mock('../services/contentSecurity.service');
jest.mock('../services/surveyHistory.service');
jest.mock('../services/session.service');
jest.mock('../../surveyResponse/services/counter.service');
jest.mock('../../auth/services/user.service');

jest.mock('src/guards/authentication.guard');
jest.mock('src/guards/survey.guard');
jest.mock('src/guards/workspace.guard');

describe('SurveyController', () => {
  let controller: SurveyController;
  let surveyMetaService: SurveyMetaService;
  let surveyConfService: SurveyConfService;
  let responseSchemaService: ResponseSchemaService;
  let surveyHistoryService: SurveyHistoryService;
  let sessionService: SessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyController],
      providers: [
        SurveyMetaService,
        {
          provide: SurveyConfService,
          useValue: {
            getSurveyConfBySurveyId: jest.fn(),
            getSurveyContentByCode: jest.fn(),
            createSurveyConf: jest.fn(),
            saveSurveyConf: jest.fn(),
          },
        },
        ResponseSchemaService,
        ContentSecurityService,
        SurveyHistoryService,
        SessionService,
        CounterService,
        UserService,
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
            info: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SurveyController>(SurveyController);
    surveyMetaService = module.get<SurveyMetaService>(SurveyMetaService);
    surveyConfService = module.get<SurveyConfService>(SurveyConfService);
    responseSchemaService = module.get<ResponseSchemaService>(
      ResponseSchemaService,
    );
    surveyHistoryService =
      module.get<SurveyHistoryService>(SurveyHistoryService);
    sessionService = module.get<SessionService>(SessionService);
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
      } as SurveyMeta);

      jest.spyOn(surveyConfService, 'createSurveyConf').mockResolvedValue({
        _id: new ObjectId(),
        pageId: newId.toString(),
      } as SurveyConf);

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

    it('should create a new survey by copy', async () => {
      const existsSurveyId = new ObjectId();
      const existsSurveyMeta = {
        _id: existsSurveyId,
        surveyType: 'exam',
        owner: 'testUser',
      } as SurveyMeta;
      const params = {
        surveyType: 'normal',
        remark: '问卷调研',
        title: '问卷调研',
        createMethod: 'copy',
        createFrom: existsSurveyId.toString(),
      };

      jest.spyOn(surveyMetaService, 'createSurveyMeta').mockResolvedValue({
        _id: new ObjectId(),
      } as SurveyMeta);

      const request = {
        user: { username: 'testUser', _id: new ObjectId() },
        surveyMeta: existsSurveyMeta,
      };

      const result = await controller.createSurvey(params, request);
      expect(result?.data?.id).toBeDefined();
    });
  });

  describe('updateConf', () => {
    it('should update survey configuration', async () => {
      const surveyId = new ObjectId();
      const surveyMeta = {
        _id: surveyId,
        surveyType: 'exam',
        owner: 'testUser',
      } as SurveyMeta;

      jest
        .spyOn(surveyConfService, 'saveSurveyConf')
        .mockResolvedValue(undefined);
      jest
        .spyOn(surveyHistoryService, 'addHistory')
        .mockResolvedValue(undefined);
      jest
        .spyOn(sessionService, 'findLatestEditingOne')
        .mockResolvedValue(null);
      jest
        .spyOn(sessionService, 'updateSessionToEditing')
        .mockResolvedValue(undefined);

      const reqBody = {
        surveyId: surveyId.toString(),
        configData: {
          bannerConf: {
            titleConfig: {},
            bannerConfig: {},
          },
          baseConf: {
            begTime: '2024-01-23 21:59:05',
            endTime: '2034-01-23 21:59:05',
          },
          bottomConf: { logoImage: '/imgs/Logo.webp', logoImageWidth: '60%' },
          skinConf: {
            skinColor: '#4a4c5b',
            inputBgColor: '#ffffff',
            backgroundConf: {
              color: '#fff',
              type: 'color',
              image: '',
            },
            themeConf: {
              color: '#ffa600',
            },
            contentConf: {
              opacity: 100,
            },
          },
          submitConf: {},
          dataConf: {
            dataList: [],
          },
        },
        sessionId: 'mock-session-id',
      };

      const result = await controller.updateConf(reqBody, {
        user: { username: 'testUser', _id: 'testUserId' },
        surveyMeta,
      });

      expect(result).toEqual({
        code: 200,
      });
    });
  });

  describe('deleteSurvey', () => {
    it('should delete a survey and its related data', async () => {
      const surveyId = new ObjectId();
      const surveyMeta = {
        _id: surveyId,
        surveyType: 'exam',
        owner: 'testUser',
      } as SurveyMeta;

      jest
        .spyOn(surveyMetaService, 'deleteSurveyMeta')
        .mockResolvedValue(undefined);
      jest
        .spyOn(responseSchemaService, 'deleteResponseSchema')
        .mockResolvedValue(undefined);

      const result = await controller.deleteSurvey({
        user: { username: 'testUser' },
        surveyMeta,
      });

      expect(result).toEqual({
        code: 200,
      });
    });
  });

  describe('getSurvey', () => {
    it('should return survey metadata and configuration', async () => {
      const surveyId = new ObjectId();
      const surveyMeta = {
        _id: surveyId,
        surveyType: 'exam',
        owner: 'testUser',
      } as SurveyMeta;

      jest
        .spyOn(surveyConfService, 'getSurveyConfBySurveyId')
        .mockResolvedValue({
          _id: new ObjectId(),
          pageId: surveyId.toString(),
        } as SurveyConf);

      const request = {
        user: { username: 'testUser', _id: new ObjectId() },
        surveyMeta,
      };
      const result = await controller.getSurvey(
        { surveyId: surveyId.toString() },
        request,
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
      } as SurveyMeta;

      jest
        .spyOn(surveyConfService, 'getSurveyConfBySurveyId')
        .mockResolvedValue({
          _id: new ObjectId(),
          pageId: surveyId.toString(),
          code: {},
        } as SurveyConf);

      jest
        .spyOn(surveyConfService, 'getSurveyContentByCode')
        .mockResolvedValue({ text: '' });

      const result = await controller.publishSurvey(
        { surveyId: surveyId.toString() },
        {
          user: { username: 'testUser', _id: new ObjectId() },
          surveyMeta,
        },
      );
      expect(result.code).toBe(200);
    });
  });
});
