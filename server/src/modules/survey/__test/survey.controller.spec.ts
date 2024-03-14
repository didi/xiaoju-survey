import { Test, TestingModule } from '@nestjs/testing';
import { SurveyController } from '../controllers/survey.controller';
import { SurveyMetaService } from '../services/surveyMeta.service';
import { SurveyConfService } from '../services/surveyConf.service';
import { ResponseSchemaService } from '../../surveyResponse/services/responseScheme.service';
import { ContentSecurityService } from '../services/contentSecurity.service';
import { SurveyHistoryService } from '../services/surveyHistory.service';
import { ObjectId } from 'mongodb';
import { SurveyMeta } from 'src/models/surveyMeta.entity';
import { SurveyConf } from 'src/models/surveyConf.entity';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';

// Mock the services
jest.mock('../services/surveyMeta.service');
jest.mock('../services/surveyConf.service');
jest.mock('../../surveyResponse/services/responseScheme.service');
jest.mock('../services/contentSecurity.service');
jest.mock('../services/surveyHistory.service');

jest.mock('src/guards/authtication');

describe('SurveyController', () => {
  let controller: SurveyController;
  let surveyMetaService: SurveyMetaService;
  let surveyConfService: SurveyConfService;
  let responseSchemaService: ResponseSchemaService;
  let contentSecurityService: ContentSecurityService;
  let surveyHistoryService: SurveyHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyController],
      providers: [
        SurveyMetaService,
        SurveyConfService,
        ResponseSchemaService,
        ContentSecurityService,
        SurveyHistoryService,
      ],
    }).compile();

    controller = module.get<SurveyController>(SurveyController);
    surveyMetaService = module.get<SurveyMetaService>(SurveyMetaService);
    surveyConfService = module.get<SurveyConfService>(SurveyConfService);
    responseSchemaService = module.get<ResponseSchemaService>(
      ResponseSchemaService,
    );
    contentSecurityService = module.get<ContentSecurityService>(
      ContentSecurityService,
    );
    surveyHistoryService =
      module.get<SurveyHistoryService>(SurveyHistoryService);
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
      } as SurveyMeta;
      const newId = new ObjectId();
      jest
        .spyOn(surveyMetaService, 'createSurveyMeta')
        .mockImplementation(() => {
          const result = {
            _id: newId,
          } as SurveyMeta;
          return Promise.resolve(result);
        });
      jest
        .spyOn(surveyConfService, 'createSurveyConf')
        .mockImplementation(
          (params: {
            surveyId: string;
            surveyType: string;
            createMethod: string;
            createFrom: string;
          }) => {
            const result = {
              _id: new ObjectId(),
              pageId: params.surveyId,
              code: {},
            } as SurveyConf;
            return Promise.resolve(result);
          },
        );

      const result = await controller.createSurvey(surveyInfo, {
        user: { username: 'testUser' },
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
      jest
        .spyOn(surveyMetaService, 'checkSurveyAccess')
        .mockResolvedValue(Promise.resolve(existsSurveyMeta));

      jest
        .spyOn(surveyMetaService, 'createSurveyMeta')
        .mockImplementation(() => {
          const result = {
            _id: new ObjectId(),
          } as SurveyMeta;
          return Promise.resolve(result);
        });

      const request = { user: { username: 'testUser' } }; // 模拟请求对象，根据实际情况进行调整
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
        .spyOn(surveyMetaService, 'checkSurveyAccess')
        .mockResolvedValue(Promise.resolve(surveyMeta));
      jest
        .spyOn(surveyConfService, 'saveSurveyConf')
        .mockResolvedValue(undefined);
      jest
        .spyOn(surveyHistoryService, 'addHistory')
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
          skinConf: { skinColor: '#4a4c5b', inputBgColor: '#ffffff' },
          submitConf: {},
          dataConf: {
            dataList: [],
          },
        },
      };

      const result = await controller.updateConf(reqBody, {
        user: { username: 'testUser', _id: 'testUserId' },
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
        .spyOn(surveyMetaService, 'checkSurveyAccess')
        .mockResolvedValue(Promise.resolve(surveyMeta));
      jest
        .spyOn(surveyMetaService, 'deleteSurveyMeta')
        .mockResolvedValue(undefined);
      jest
        .spyOn(responseSchemaService, 'deleteResponseSchema')
        .mockResolvedValue(undefined);

      const result = await controller.deleteSurvey(
        { surveyId: surveyId.toString() },
        { user: { username: 'testUser' } },
      );

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
        .spyOn(surveyMetaService, 'checkSurveyAccess')
        .mockResolvedValue(Promise.resolve(surveyMeta));

      jest
        .spyOn(surveyConfService, 'getSurveyConfBySurveyId')
        .mockResolvedValue(
          Promise.resolve({
            _id: new ObjectId(),
            pageId: surveyId.toString(),
          } as SurveyConf),
        );

      const request = { user: { username: 'testUser' } };
      const result = await controller.getSurvey(
        { surveyId: surveyId.toString() },
        request,
      );
      expect(result?.data?.surveyMetaRes).toBeDefined();
      expect(result?.data?.surveyConfRes).toBeDefined();
    });
  });

  describe('publishSurvey', () => {
    it('should publish a survey success', async () => {
      const surveyId = new ObjectId();
      const surveyMeta = {
        _id: surveyId,
        surveyType: 'exam',
        owner: 'testUser',
      } as SurveyMeta;

      jest
        .spyOn(surveyMetaService, 'checkSurveyAccess')
        .mockResolvedValue(Promise.resolve(surveyMeta));

      jest
        .spyOn(surveyConfService, 'getSurveyConfBySurveyId')
        .mockResolvedValue(
          Promise.resolve({
            _id: new ObjectId(),
            pageId: surveyId.toString(),
          } as SurveyConf),
        );

      jest
        .spyOn(surveyConfService, 'getSurveyContentByCode')
        .mockResolvedValue({
          text: '题目1',
        });

      jest
        .spyOn(contentSecurityService, 'isForbiddenContent')
        .mockResolvedValue(false);
      jest
        .spyOn(surveyMetaService, 'publishSurveyMeta')
        .mockResolvedValue(undefined);
      jest
        .spyOn(responseSchemaService, 'publishResponseSchema')
        .mockResolvedValue(undefined);
      jest
        .spyOn(surveyHistoryService, 'addHistory')
        .mockResolvedValue(undefined);

      const result = await controller.publishSurvey(
        { surveyId: surveyId.toString() },
        { user: { username: 'testUser', _id: 'testUserId' } },
      );

      expect(result).toEqual({
        code: 200,
      });
    });

    it('should not publish a survey with forbidden content', async () => {
      const surveyId = new ObjectId();
      const surveyMeta = {
        _id: surveyId,
        surveyType: 'normal',
        owner: 'testUser',
      } as SurveyMeta;

      jest
        .spyOn(surveyMetaService, 'checkSurveyAccess')
        .mockResolvedValue(Promise.resolve(surveyMeta));

      jest
        .spyOn(surveyConfService, 'getSurveyConfBySurveyId')
        .mockResolvedValue(
          Promise.resolve({
            _id: new ObjectId(),
            pageId: surveyId.toString(),
          } as SurveyConf),
        );

      jest
        .spyOn(surveyConfService, 'getSurveyContentByCode')
        .mockResolvedValue({
          text: '违禁词',
        });

      jest
        .spyOn(contentSecurityService, 'isForbiddenContent')
        .mockResolvedValue(true);

      await expect(
        controller.publishSurvey(
          { surveyId: surveyId.toString() },
          { user: { username: 'testUser', _id: 'testUserId' } },
        ),
      ).rejects.toThrow(
        new HttpException(
          '问卷存在非法关键字，不允许发布',
          EXCEPTION_CODE.SURVEY_CONTENT_NOT_ALLOW,
        ),
      );
    });
  });
});
