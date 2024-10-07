import { Test, TestingModule } from '@nestjs/testing';
import { DataStatisticService } from '../services/dataStatistic.service';
import { MongoRepository } from 'typeorm';
import { SurveyResponse } from 'src/models/surveyResponse.entity';
import {
  mockResponseSchema,
  mockSensitiveResponseSchema,
} from './mockResponseSchema';
import { ObjectId } from 'mongodb';
import { cloneDeep } from 'lodash';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RECORD_STATUS } from 'src/enums';
import { PluginManagerProvider } from 'src/securityPlugin/pluginManager.provider';
import { PluginManager } from 'src/securityPlugin/pluginManager';
import { ResponseSecurityPlugin } from 'src/securityPlugin/responseSecurityPlugin';

describe('DataStatisticService', () => {
  let service: DataStatisticService;
  let surveyResponseRepository: MongoRepository<SurveyResponse>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataStatisticService,
        {
          provide: getRepositoryToken(SurveyResponse),
          useClass: MongoRepository,
        },
        PluginManagerProvider,
      ],
    }).compile();

    service = module.get<DataStatisticService>(DataStatisticService);
    surveyResponseRepository = module.get<MongoRepository<SurveyResponse>>(
      getRepositoryToken(SurveyResponse),
    );
    const manager = module.get<PluginManager>(PluginManager);
    manager.registerPlugin(
      new ResponseSecurityPlugin('dataAesEncryptSecretKey'),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDataTable', () => {
    it('should return correct table data', async () => {
      const surveyId = '65afc62904d5db18534c0f78';
      const pageNum = 1;
      const pageSize = 10;

      const responseSchema = mockResponseSchema;
      const surveyResponseList = [
        {
          _id: new ObjectId('65f1baff92862d6a9067ad0c'),
          pageId: '65afc62904d5db18534c0f78',
          surveyPath: 'JgMLGInV',
          data: {
            data458: '111',
            data549: '222',
            data515_115019: '333',
            data515: '115019',
            data997_211974: '444',
            data997: ['211974', '842501'],
            data517: '917392',
            data413_3: '555',
            data413: 3,
            data863: '109239',
          },
          diffTime: 21278,
          clientTime: 1710340862733.0,
          secretKeys: [],
          optionTextAndId: {
            data549: [
              {
                hash: '273008',
                text: '选项1',
              },
              {
                hash: '160703',
                text: '选项2',
              },
            ],
            data515: [
              {
                hash: '115019',
                text: '<p>选项1</p>',
              },
              {
                hash: '115020',
                text: '<p>选项2</p>',
              },
              {
                hash: '119074',
                text: '<p>选项</p>',
              },
            ],
            data997: [
              {
                hash: '211974',
                text: '<p>选项1</p>',
              },
              {
                hash: '842501',
                text: '<p>选项2</p>',
              },
              {
                hash: '650873',
                text: '<p>选项</p>',
              },
            ],
            data517: [
              {
                hash: '917392',
                text: '对',
              },
              {
                hash: '156728',
                text: '错',
              },
            ],
            data413: [
              {
                hash: '502734',
                text: '选项1',
              },
              {
                hash: '278946',
                text: '选项2',
              },
            ],
            data863: [
              {
                hash: '109239',
                text: '<p>选项1</p>',
              },
              {
                hash: '899262',
                text: '<p>选项2</p>',
              },
            ],
          },
          curStatus: {
            status: RECORD_STATUS.NEW,
            date: 1710340863123.0,
          },
          statusList: [
            {
              status: RECORD_STATUS.NEW,
              date: 1710340863123.0,
            },
          ],
          createdAt: 1710340863123.0,
          updatedAt: 1710340863123.0,
        },
      ] as unknown as Array<SurveyResponse>;

      jest
        .spyOn(surveyResponseRepository, 'findAndCount')
        .mockResolvedValue([surveyResponseList, surveyResponseList.length]);

      const result = await service.getDataTable({
        surveyId,
        pageNum,
        pageSize,
        responseSchema,
      });
      expect(result).toEqual({
        total: 1,
        listHead: expect.arrayContaining([
          expect.objectContaining({
            field: expect.any(String),
            title: expect.any(String),
            type: expect.stringMatching(
              /^(text|textarea|radio|checkbox|binary-choice|radio-star|vote)$/,
            ),
            othersCode: expect.arrayContaining([
              expect.objectContaining({
                code: expect.any(String),
                option: expect.any(String),
              }),
            ]),
          }),
        ]),
        listBody: expect.arrayContaining([
          expect.objectContaining({
            data458: expect.any(String),
            data549: expect.any(String),
            data515_115019: expect.any(String),
            data515: expect.any(String),
            data997_211974: expect.any(String),
            data997: expect.any(String),
            data517: expect.any(String),
            data413_3: expect.any(String),
            data413: expect.any(Number),
            data863: expect.any(String),
            diffTime: expect.any(String),
            createdAt: expect.any(String),
          }),
        ]),
      });
    });

    it('should return desensitized table data', async () => {
      const mockSchema = cloneDeep(mockSensitiveResponseSchema);
      const surveyResponseList: Array<SurveyResponse> = [
        {
          _id: new ObjectId('65f2a2e892862d6a9067ad29'),
          pageId: '65f29f3192862d6a9067ad1c',
          surveyPath: 'EBzdmnSp',
          data: {
            data458: 'U2FsdGVkX18IlyS9gSKNTAG0llOVQmrGUzRn/r95VKw=',
            data515: '115019',
            data450:
              'U2FsdGVkX1+ArNkHhqSmHrCWWT2oxTGBlyTcXdJfQTwqBouROeITBx/aAp7pjKk4',
            data405:
              'U2FsdGVkX19bRmf3uEmXAJ/6zXd1Znr3cZsD5v4Nocr2v5XG1taXluz8cohFkDyH',
            data770: 'U2FsdGVkX18ldQMhJjFXO8aerjftZLpFnRQ4/FVcCLI=',
          },
          diffTime: 806707,
          clientTime: 1710400229573.0,
          secretKeys: ['data458', 'data450', 'data405', 'data770'],
          optionTextAndId: {
            data515: [
              {
                hash: '115019',
                text: '<p>男</p>',
              },
              {
                hash: '115020',
                text: '<p>女</p>',
              },
            ],
            data450: [
              {
                hash: '979954',
                text: '选项1',
              },
              {
                hash: '083007',
                text: '选项2',
              },
            ],
            data405: [
              {
                hash: '443109',
                text: '选项1',
              },
              {
                hash: '871142',
                text: '选项2',
              },
            ],
            data770: [
              {
                hash: '051056',
                text: '选项1',
              },
              {
                hash: '835356',
                text: '选项2',
              },
            ],
          },
          curStatus: {
            status: RECORD_STATUS.NEW,
            date: 1710400232161.0,
          },
          statusList: [
            {
              status: RECORD_STATUS.NEW,
              date: 1710400232161.0,
            },
          ],
          createdAt: 1710400232161.0,
          updatedAt: 1710400232161.0,
        },
      ] as unknown as Array<SurveyResponse>;

      const surveyId = mockSchema.pageId;
      const pageNum = 1;
      const pageSize = 10;

      jest
        .spyOn(surveyResponseRepository, 'findAndCount')
        .mockResolvedValue([surveyResponseList, surveyResponseList.length]);

      const result = await service.getDataTable({
        surveyId,
        pageNum,
        pageSize,
        responseSchema: mockSchema,
      });
      expect(result.listBody).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            createdAt: expect.any(String),
            data405: expect.any(String),
            data450: expect.any(String),
            data458: expect.any(String),
            data515: expect.any(String),
            data770: expect.any(String),
            diffTime: expect.any(String),
          }),
        ]),
      );
    });
  });

  describe('aggregationStatis', () => {
    it('should return correct aggregation data', async () => {
      const surveyId = '65afc62904d5db18534c0f78';
      const mockAggregationResult = {
        data515: [
          {
            count: 1,
            data: {
              data515: '115019',
            },
          },
          {
            count: 1,
            data: {
              data515: '115020',
            },
          },
        ],
        data893: [
          {
            count: 1,
            data: {
              data893: ['466671'],
            },
          },
          {
            count: 1,
            data: {
              data893: ['466671', '095415'],
            },
          },
        ],
        data820: [
          {
            count: 1,
            data: {
              data820: 8,
            },
          },
        ],
        data549: [
          {
            count: 1,
            data: {
              data549: 5,
            },
          },
        ],
      };

      const fieldList = Object.keys(mockAggregationResult);

      jest.spyOn(surveyResponseRepository, 'aggregate').mockReturnValue({
        next: jest.fn().mockResolvedValue(mockAggregationResult),
      } as any);

      const result = await service.aggregationStatis({
        surveyId,
        fieldList,
      });

      expect(result).toEqual(
        expect.arrayContaining([
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
        ]),
      );
    });

    it('should return empty aggregation data when no responses', async () => {
      const surveyId = '65afc62904d5db18534c0f78';
      const fieldList = ['data458', 'data515'];

      jest.spyOn(surveyResponseRepository, 'aggregate').mockReturnValue({
        next: jest.fn().mockResolvedValue({}),
      } as any);

      const result = await service.aggregationStatis({
        surveyId,
        fieldList,
      });

      expect(result).toEqual(
        expect.arrayContaining([
          {
            field: 'data458',
            data: {
              aggregation: [],
              submitionCount: 0,
            },
          },
          {
            field: 'data515',
            data: {
              aggregation: [],
              submitionCount: 0,
            },
          },
        ]),
      );
    });
  });
});
