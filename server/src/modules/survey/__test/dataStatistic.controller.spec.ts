import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongodb';

import { DataStatisticController } from '../controllers/dataStatistic.controller';
import { DataStatisticService } from '../services/dataStatistic.service';
import { SurveyMetaService } from '../services/surveyMeta.service';
import { ResponseSchemaService } from '../../surveyResponse/services/responseScheme.service';

import { PluginManagerProvider } from 'src/securityPlugin/pluginManager.provider';
import { XiaojuSurveyPluginManager } from 'src/securityPlugin/pluginManager';
import { Logger } from 'src/logger';

import { UserService } from 'src/modules/auth/services/user.service';
import { ResponseSecurityPlugin } from 'src/securityPlugin/responseSecurityPlugin';
import { AuthService } from 'src/modules/auth/services/auth.service';

jest.mock('../services/dataStatistic.service');
jest.mock('../services/surveyMeta.service');
jest.mock('../../surveyResponse/services/responseScheme.service');

jest.mock('src/guards/authentication.guard');
jest.mock('src/guards/survey.guard');
jest.mock('src/guards/workspace.guard');

describe('DataStatisticController', () => {
  let controller: DataStatisticController;
  let dataStatisticService: DataStatisticService;

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
    const pluginManager = module.get<XiaojuSurveyPluginManager>(
      XiaojuSurveyPluginManager,
    );
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
            othersCode: 'xxx',
          },
        ],
        listBody: [
          { difTime: '0.5', createDate: '2024-02-11' },
          { difTime: '0.5', createDate: '2024-02-11' },
        ],
      };

      jest
        .spyOn(controller['responseSchemaService'], 'getResponseSchemaByPageId')
        .mockResolvedValueOnce({} as any);
      jest
        .spyOn(dataStatisticService, 'getDataTable')
        .mockResolvedValueOnce(mockDataTable);

      const result = await controller.data(mockRequest.query, {});

      expect(result).toEqual({
        code: 200,
        data: mockDataTable,
      });
    });

    it('should return data table with isDesensitive', async () => {
      const surveyId = new ObjectId().toString();
      const mockRequest = {
        query: {
          surveyId,
          isDesensitive: true,
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
            othersCode: 'xxx',
          },
        ],
        listBody: [
          { difTime: '0.5', createDate: '2024-02-11', data123: '15200000000' },
          { difTime: '0.5', createDate: '2024-02-11', data123: '13800000000' },
        ],
      };
      jest
        .spyOn(controller['responseSchemaService'], 'getResponseSchemaByPageId')
        .mockResolvedValueOnce({} as any);
      jest
        .spyOn(dataStatisticService, 'getDataTable')
        .mockResolvedValueOnce(mockDataTable);

      const result = await controller.data(mockRequest.query, {});

      expect(result).toEqual({
        code: 200,
        data: mockDataTable,
      });
    });
  });
});
