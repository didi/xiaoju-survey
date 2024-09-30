import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongodb';

import { DataStatisticController } from '../controllers/dataStatistic.controller';
import { DataStatisticService } from '../services/dataStatistic.service';
import { SurveyMetaService } from '../services/surveyMeta.service';
import { ResponseSchemaService } from '../../surveyResponse/services/responseScheme.service';

import { PluginManagerProvider } from 'src/securityPlugin/pluginManager.provider';
import { PluginManager } from 'src/securityPlugin/pluginManager';
import { Logger } from 'src/logger';

import { UserService } from 'src/modules/auth/services/user.service';
import { ResponseSecurityPlugin } from 'src/securityPlugin/responseSecurityPlugin';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { HttpException } from 'src/exceptions/httpException';

jest.mock('../services/dataStatistic.service');
jest.mock('../services/surveyMeta.service');
jest.mock('../../surveyResponse/services/responseScheme.service');

jest.mock('src/guards/authentication.guard');
jest.mock('src/guards/survey.guard');

describe('DataStatisticController', () => {
  let controller: DataStatisticController;
  let dataStatisticService: DataStatisticService;
  let responseSchemaService: ResponseSchemaService;
  let pluginManager: PluginManager;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataStatisticController],
      providers: [
        DataStatisticService,
        SurveyMetaService,
        ResponseSchemaService,
        PluginManagerProvider,
        ConfigService,
        {
          provide: UserService,
          useClass: jest.fn().mockImplementation(() => ({
            getUserByUsername() {
              return {};
            },
          })),
        },
        {
          provide: AuthService,
          useClass: jest.fn().mockImplementation(() => ({
            varifytoken() {
              return {};
            },
          })),
        },
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DataStatisticController>(DataStatisticController);
    dataStatisticService =
      module.get<DataStatisticService>(DataStatisticService);
    responseSchemaService = module.get<ResponseSchemaService>(
      ResponseSchemaService,
    );
    pluginManager = module.get<PluginManager>(PluginManager);
    logger = module.get<Logger>(Logger);

    pluginManager.registerPlugin(
      new ResponseSecurityPlugin('dataAesEncryptSecretKey'),
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('data', () => {
    it('should return data table', async () => {
      const surveyId = new ObjectId().toString();
      const mockRequest = {
        query: {
          surveyId,
          isMasked: false,
          page: 1,
          pageSize: 10,
        },
        user: {
          username: 'testUser',
        },
      };

      const mockDataTable = {
        total: 10,
        listHead: [
          {
            field: 'xxx',
            title: 'xxx',
            type: 'xxx',
            diffTime: 'xxx',
            othersCode: 'xxx',
          },
        ],
        listBody: [
          { diffTime: '0.5', createdAt: '2024-02-11' },
          { diffTime: '0.5', createdAt: '2024-02-11' },
        ],
      };

      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPageId')
        .mockResolvedValueOnce({} as any);
      jest
        .spyOn(dataStatisticService, 'getDataTable')
        .mockResolvedValueOnce(mockDataTable);

      const result = await controller.data(mockRequest.query);

      expect(result).toEqual({
        code: 200,
        data: mockDataTable,
      });
    });

    it('should return data table with isMasked', async () => {
      const surveyId = new ObjectId().toString();
      const mockRequest = {
        query: {
          surveyId,
          isMasked: true,
          page: 1,
          pageSize: 10,
        },
        user: {
          username: 'testUser',
        },
      };

      const mockDataTable = {
        total: 10,
        listHead: [
          {
            field: 'xxx',
            title: 'xxx',
            type: 'xxx',
            diffTime: 'xxx',
            othersCode: 'xxx',
          },
        ],
        listBody: [
          { diffTime: '0.5', createdAt: '2024-02-11', data123: '15200000000' },
          { diffTime: '0.5', createdAt: '2024-02-11', data123: '13800000000' },
        ],
      };

      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPageId')
        .mockResolvedValueOnce({} as any);
      jest
        .spyOn(dataStatisticService, 'getDataTable')
        .mockResolvedValueOnce(mockDataTable);

      const result = await controller.data(mockRequest.query);

      expect(result).toEqual({
        code: 200,
        data: mockDataTable,
      });
    });

    it('should throw an exception if validation fails', async () => {
      const mockRequest = {
        query: {
          surveyId: '',
        },
        user: {
          username: 'testUser',
        },
      };

      await expect(controller.data(mockRequest.query)).rejects.toThrow(
        HttpException,
      );
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('aggregationStatis', () => {
    it('should return aggregation statistics', async () => {
      const mockRequest = {
        query: {
          surveyId: new ObjectId().toString(),
        },
      };

      const mockResponseSchema = {
        _id: new ObjectId('6659c3283b1cb279bc2e2b0c'),
        curStatus: {
          status: 'published',
          date: 1717159136024,
        },
        statusList: [
          {
            status: 'published',
            date: 1717158851823,
          },
        ],
        createdAt: 1717158851823,
        updatedAt: 1717159136025,
        title: '问卷调研',
        surveyPath: 'ZdGNzTTR',
        code: {
          bannerConf: {
            titleConfig: {
              mainTitle:
                '<h3 style="text-align: center">欢迎填写问卷</h3><p>为了给您提供更好的服务，希望您能抽出几分钟时间，将您的感受和建议告诉我们，<span style="color: rgb(204, 0, 0)">期待您的参与！</span></p>',
              subTitle: '',
              applyTitle: '',
            },
            bannerConfig: {
              bgImage: '/imgs/skin/17e06b7604a007e1d3e1453b9ddadc3c.webp',
              bgImageAllowJump: false,
              bgImageJumpLink: '',
              videoLink: '',
              postImg: '',
            },
          },
          baseConf: {
            beginTime: '2024-05-31 20:31:36',
            endTime: '2034-05-31 20:31:36',
            language: 'chinese',
            showVoteProcess: 'allow',
            tLimit: 0,
            answerBegTime: '00:00:00',
            answerEndTime: '23:59:59',
            answerLimitTime: 0,
          },
          bottomConf: {
            logoImage: '/imgs/Logo.webp',
            logoImageWidth: '60%',
          },
          skinConf: {
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
            skinColor: '#4a4c5b',
            inputBgColor: '#ffffff',
          },
          submitConf: {
            submitTitle: '提交',
            msgContent: {
              msg_200: '提交成功',
              msg_9001: '您来晚了，感谢支持问卷~',
              msg_9002: '请勿多次提交！',
              msg_9003: '您来晚了，已经满额！',
              msg_9004: '提交失败！',
            },
            confirmAgain: {
              is_again: true,
              again_text: '确认要提交吗？',
            },
            link: '',
          },
          logicConf: {
            showLogicConf: [],
          },
          dataConf: {
            dataList: [
              {
                isRequired: true,
                showIndex: true,
                showType: true,
                showSpliter: true,
                type: 'radio',
                placeholderDesc: '',
                field: 'data515',
                title: '标题2',
                placeholder: '',
                randomSort: false,
                checked: false,
                minNum: '',
                maxNum: '',
                options: [
                  {
                    text: '选项1',
                    imageUrl: '',
                    others: false,
                    mustOthers: false,
                    othersKey: '',
                    placeholderDesc: '',
                    hash: '115019',
                  },
                  {
                    text: '选项2',
                    imageUrl: '',
                    others: false,
                    mustOthers: false,
                    othersKey: '',
                    placeholderDesc: '',
                    hash: '115020',
                  },
                ],
                importKey: 'single',
                importData: '',
                cOption: '',
                cOptions: [],
                star: 5,
                exclude: false,
                textRange: {
                  min: {
                    placeholder: '0',
                    value: 0,
                  },
                  max: {
                    placeholder: '500',
                    value: 500,
                  },
                },
              },
              {
                field: 'data893',
                showIndex: true,
                showType: true,
                showSpliter: true,
                type: 'checkbox',
                placeholderDesc: '',
                sLimit: 0,
                mhLimit: 0,
                title: '标题2',
                placeholder: '',
                valid: '',
                isRequired: true,
                randomSort: false,
                showLeftNum: true,
                innerRandom: false,
                checked: false,
                selectType: 'radio',
                sortWay: 'v',
                noNps: '',
                minNum: '',
                maxNum: '',
                starStyle: 'star',
                starMin: 1,
                starMax: 5,
                min: 0,
                max: 10,
                minMsg: '极不满意',
                maxMsg: '十分满意',
                rangeConfig: {},
                options: [
                  {
                    text: '选项1',
                    others: false,
                    othersKey: '',
                    placeholderDesc: '',
                    hash: '466671',
                  },
                  {
                    text: '选项2',
                    others: false,
                    othersKey: '',
                    placeholderDesc: '',
                    hash: '095415',
                  },
                ],
                star: 5,
                optionOrigin: '',
                originType: 'selected',
                matrixOptionsRely: '',
                numberRange: {
                  min: {
                    placeholder: '0',
                    value: 0,
                  },
                  max: {
                    placeholder: '1000',
                    value: 1000,
                  },
                },
                textRange: {
                  min: {
                    placeholder: '0',
                    value: 0,
                  },
                  max: {
                    placeholder: '500',
                    value: 500,
                  },
                },
              },
              {
                field: 'data820',
                showIndex: true,
                showType: true,
                showSpliter: true,
                type: 'radio-nps',
                placeholderDesc: '',
                sLimit: 0,
                mhLimit: 0,
                title: '标题3',
                placeholder: '',
                valid: '',
                isRequired: true,
                randomSort: false,
                showLeftNum: true,
                innerRandom: false,
                checked: false,
                selectType: 'radio',
                sortWay: 'v',
                noNps: '',
                minNum: '',
                maxNum: '',
                starStyle: 'star',
                starMin: 1,
                starMax: 5,
                min: 0,
                max: 10,
                minMsg: '极不满意',
                maxMsg: '十分满意',
                rangeConfig: {},
                options: [
                  {
                    text: '选项1',
                    others: false,
                    othersKey: '',
                    placeholderDesc: '',
                    hash: '268884',
                  },
                  {
                    text: '选项2',
                    others: false,
                    othersKey: '',
                    placeholderDesc: '',
                    hash: '371166',
                  },
                ],
                star: 5,
                optionOrigin: '',
                originType: 'selected',
                matrixOptionsRely: '',
                numberRange: {
                  min: {
                    placeholder: '0',
                    value: 0,
                  },
                  max: {
                    placeholder: '1000',
                    value: 1000,
                  },
                },
                textRange: {
                  min: {
                    placeholder: '0',
                    value: 0,
                  },
                  max: {
                    placeholder: '500',
                    value: 500,
                  },
                },
              },
              {
                field: 'data549',
                showIndex: true,
                showType: true,
                showSpliter: true,
                type: 'radio-star',
                placeholderDesc: '',
                sLimit: 0,
                mhLimit: 0,
                title: '标题4',
                placeholder: '',
                valid: '',
                isRequired: true,
                randomSort: false,
                showLeftNum: true,
                innerRandom: false,
                checked: false,
                selectType: 'radio',
                sortWay: 'v',
                noNps: '',
                minNum: '',
                maxNum: '',
                starStyle: 'star',
                starMin: 1,
                starMax: 5,
                min: 0,
                max: 10,
                minMsg: '极不满意',
                maxMsg: '十分满意',
                rangeConfig: {},
                options: [
                  {
                    text: '选项1',
                    others: false,
                    othersKey: '',
                    placeholderDesc: '',
                    hash: '274183',
                  },
                  {
                    text: '选项2',
                    others: false,
                    othersKey: '',
                    placeholderDesc: '',
                    hash: '842967',
                  },
                ],
                star: 5,
                optionOrigin: '',
                originType: 'selected',
                matrixOptionsRely: '',
                numberRange: {
                  min: {
                    placeholder: '0',
                    value: 0,
                  },
                  max: {
                    placeholder: '1000',
                    value: 1000,
                  },
                },
                textRange: {
                  min: {
                    placeholder: '0',
                    value: 0,
                  },
                  max: {
                    placeholder: '500',
                    value: 500,
                  },
                },
              },
            ],
          },
        },
        pageId: '6659c3283b1cb279bc2e2b0c',
      };

      const mockAggregationResult = [
        {
          field: 'data515',
          data: {
            aggregation: [
              {
                id: '115019',
                count: 1,
              },
              {
                id: '115020',
                count: 1,
              },
            ],
            submitionCount: 2,
          },
        },
        {
          field: 'data893',
          data: {
            aggregation: [
              {
                id: '466671',
                count: 2,
              },
              {
                id: '095415',
                count: 1,
              },
            ],
            submitionCount: 2,
          },
        },
        {
          field: 'data820',
          data: {
            aggregation: [
              {
                id: '8',
                count: 1,
              },
            ],
            submitionCount: 1,
          },
        },
        {
          field: 'data549',
          data: {
            aggregation: [
              {
                id: '5',
                count: 1,
              },
            ],
            submitionCount: 1,
          },
        },
      ];

      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPageId')
        .mockResolvedValueOnce(mockResponseSchema as any);
      jest
        .spyOn(dataStatisticService, 'aggregationStatis')
        .mockResolvedValueOnce(mockAggregationResult);

      const result = await controller.aggregationStatis(mockRequest.query);

      expect(result).toEqual({
        code: 200,
        data: expect.any(Array),
      });
    });

    it('should throw an exception if validation fails', async () => {
      const mockRequest = {
        query: {
          surveyId: '',
        },
      };

      await expect(
        controller.aggregationStatis(mockRequest.query),
      ).rejects.toThrow(HttpException);
    });

    it('should return empty data if response schema does not exist', async () => {
      const mockRequest = {
        query: {
          surveyId: new ObjectId().toString(),
        },
      };

      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPageId')
        .mockResolvedValueOnce(null);

      const result = await controller.aggregationStatis(mockRequest.query);

      expect(result).toEqual({
        code: 200,
        data: [],
      });
    });
  });
});
