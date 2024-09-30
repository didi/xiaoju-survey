import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import { cloneDeep } from 'lodash';

import { mockResponseSchema } from './mockResponseSchema';

import { SurveyResponseController } from '../controllers/surveyResponse.controller';

import { ResponseSchemaService } from '../services/responseScheme.service';
import { CounterService } from '../services/counter.service';
import { SurveyResponseService } from '../services/surveyResponse.service';
import { ClientEncryptService } from '../services/clientEncrypt.service';
import { MessagePushingTaskService } from 'src/modules/message/services/messagePushingTask.service';

import { PluginManagerProvider } from 'src/securityPlugin/pluginManager.provider';
import { PluginManager } from 'src/securityPlugin/pluginManager';
import { HttpException } from 'src/exceptions/httpException';
import { SurveyNotFoundException } from 'src/exceptions/surveyNotFoundException';
import { ResponseSecurityPlugin } from 'src/securityPlugin/responseSecurityPlugin';

import { RECORD_STATUS, RECORD_SUB_STATUS } from 'src/enums';
import { SurveyResponse } from 'src/models/surveyResponse.entity';
import { Logger } from 'src/logger';
import { ResponseSchema } from 'src/models/responseSchema.entity';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { UserService } from 'src/modules/auth/services/user.service';
import { WorkspaceMemberService } from 'src/modules/workspace/services/workspaceMember.service';

const mockDecryptErrorBody = {
  surveyPath: 'EBzdmnSp',
  data: [
    'SkyfsbS6MDvFrrxFJQDMxsvm53G3PTURktfZikJP2fKilC8wPW5ZdfX29Fixor5ldHBBNyILsDtxhbNahEbNCDw8n1wS8IIckFuQcaJtn6MLOD+h+Iuywka3ig4ecTN87RpdcfEQe7f38rSSx0zoFU8j37eojjSF7eETBSrz5m9WaNesQo4hhC6p7wmAo1jggkdbG8PVrFqrZPbkHN5jOBrzQEqdqYu9A5wHMM7nUteqlPpkiogEDYmBIccqmPdtO54y7LoPslXgXj6jNja8oVNaYlnp7UsisT+i5cuQ7lbDukEhrfpAIFRsT2IUwVlLjWHtFQm4/4I5HyvVBirTng==',
    'IMn0E7R6cYCQPI497mz3x99CPA4cImAFEfIv8Q98Gm5bFcgKJX6KFYS7PF/VtIuI1leKwwNYexQy7+2HnF40by/huVugoPYnPd4pTpUdG6f1kh8EpzIir2+8P98Dcz2+NZ/khP2RIAM8nOr+KSC99TNGhuKaKQCItyLFDkr80s3zv+INieGc8wULIrGoWDJGN2KdU/jSq+hkV0QXypd81N5IyAoNhZLkZeM/FU6grGFPnGRtcDDc5W8YWVHO87VymlxPCTRawXRTDcvGIUqb3GuZfxvA7AULqbspmN9kzt3rktuZLNb2TFQDsJfqUuCmi+b28qP/G4OrT9/VAHhYKw==',
  ],
  diffTime: 806707,
  clientTime: 1710400229573,
  encryptType: 'rsa',
  sessionId: '65f2664c92862d6a9067ad18',
  sign: '95d6ff5dd3d9ddc205cbab88defe40ebe889952961f1d60e760fa411e2cb39fe.1710400229589',
};

const mockSubmitData = {
  surveyPath: 'EBzdmnSp',
  data: [
    'SkyfsbS6MDvFrrxFJQDMxsvm53G3PTURktfZikJP2fKilC8wPW5ZdfX29Fixor5ldHBBNyILsDtxhbNahEbNCDw8n1wS8IIckFuQcaJtn6MLOD+h+Iuywka3ig4ecTN87RpdcfEQe7f38rSSx0zoFU8j37eojjSF7eETBSrz5m9WaNesQo4hhC6p7wmAo1jggkdbG8PVrFqrZPbkHN5jOBrzQEqdqYu9A5wHMM7nUteqlPpkiogEDYmBIccqmPdtO54y7LoPslXgXj6jNja8oVNaYlnp7UsisT+i5cuQ7lbDukEhrfpAIFRsT2IUwVlLjWHtFQm4/4I5HyvVBirTng==',
    'IMn0E7R6cYCQPI497mz3x99CPA4cImAFEfIv8Q98Gm5bFcgKJX6KFYS7PF/VtIuI1leKwwNYexQy7+2HnF40by/huVugoPYnPd4pTpUdG6f1kh8EpzIir2+8P98Dcz2+NZ/khP2RIAM8nOr+KSC99TNGhuKaKQCItyLFDkr80s3zv+INieGc8wULIrGoWDJGN2KdU/jSq+hkV0QXypd81N5IyAoNhZLkZeM/FU6grGFPnGRtcDDc5W8YWVHO87VymlxPCTRawXRTDcvGIUqb3GuZfxvA7AULqbspmN9kzt3rktuZLNb2TFQDsJfqUuCmi+b28qP/G4OrT9/VAHhYKw==',
  ],
  diffTime: 806707,
  clientTime: 1710400229573,
  encryptType: 'rsa',
  sessionId: '65f29fc192862d6a9067ad28',
  sign: '95d6ff5dd3d9ddc205cbab88defe40ebe889952961f1d60e760fa411e2cb39fe.1710400229589',
};

const mockClientEncryptInfo = {
  _id: new ObjectId('65f29fc192862d6a9067ad28'),
  data: {
    publicKey:
      '-----BEGIN PUBLIC KEY-----\r\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA45uWd29i6dcjLP2Cp4IV\r\naGASv+tHeaqQt8t7jojtc6rO46dD0CUkPTo9aewtuDxTHFDiKWJRJMRdXIUFNqVH\r\n1SKX7rCSG/Fh9G14pnddnSFF1eagGfvXBptycp5vKQb1IYT85zqqfORI6mGnhsQ/\r\nj+POVkIb+ANAAUXo8O/kLpVk0+cbitZYFZZWzhf+ZtSRhitlD55zonJ+Nz2hWpmr\r\npeKAG0VTRX27fDUyu2YpVFbwz7SjDsbdZ/L8XjLsUaHzRaDHL6sYYH7cWIQzj2DQ\r\nzhkR+RzeQNiSct0k7kmQ8LotWv/8sER0/yglXXH0Go42myjMI7i/2T7NpJ2ywxa3\r\nCwIDAQAB\r\n-----END PUBLIC KEY-----\r\n',
    privateKey:
      '-----BEGIN RSA PRIVATE KEY-----\r\nMIIEowIBAAKCAQEA45uWd29i6dcjLP2Cp4IVaGASv+tHeaqQt8t7jojtc6rO46dD\r\n0CUkPTo9aewtuDxTHFDiKWJRJMRdXIUFNqVH1SKX7rCSG/Fh9G14pnddnSFF1eag\r\nGfvXBptycp5vKQb1IYT85zqqfORI6mGnhsQ/j+POVkIb+ANAAUXo8O/kLpVk0+cb\r\nitZYFZZWzhf+ZtSRhitlD55zonJ+Nz2hWpmrpeKAG0VTRX27fDUyu2YpVFbwz7Sj\r\nDsbdZ/L8XjLsUaHzRaDHL6sYYH7cWIQzj2DQzhkR+RzeQNiSct0k7kmQ8LotWv/8\r\nsER0/yglXXH0Go42myjMI7i/2T7NpJ2ywxa3CwIDAQABAoIBAEfqKhGUpRkje57E\r\nftq0VFVFPcdb7Jp5lP4tkd2IUBZi2rm9aMTEZ33c//iOwidbEBt7RuoygVbvoFwS\r\nP4JzmI20P3MQYSnpC70yNZPLVU3HbIxYMS/kjZ0t0mx6uL6qzxsHLO1WcPXDH3LG\r\n5irDqR2qqdBBVRr40+lTEHXIJj29J5NNWjGcCtv8EkqzrhHjF0XypVrGsFCdm0yB\r\n3We1ypU68JC4AFzheC4ckk7Cm90oMC8eIqn8iYb4w24NYzyqDOcHupBlljHzxT8x\r\n89cy490LKI0j06+OchlSHWgy2ixO4s1futTCA789f68+ZEhtv8gNsLpY3+iI35ni\r\n/M5+VHkCgYEA+2PUd9UNkQVAQp8UVThkEgfRs4T9DF0RXD1HpzYev4gj/KbZGCw5\r\nUlOC7ufiY7MfVPil2tC9vv/pjzyATHNP1liM97AIhB/bj5V5wOvPXEGVyey/MkBw\r\n4e2cf4xFfaJL2piE/FqJ1kDrbDN4vEC8fz0lvR9NhfEVFHgtUyp3zgcCgYEA58gc\r\nQ5z7M0n1/YzDVtMcuXzeKLP1mBavelhy8W6OgGwOoMixsobEo4Rx7EFWBXNGmc8K\r\n5yXzN7UEdrpCUNGoU0j51B7q7qf+I/bp0k09q7BEKT+bEYvYaDALVxvqKHUaAafI\r\nQUWCu7TWmymHCiWtkHnMTkcyN6baJCdAaK1Qjd0CgYB12UfqYVt5x69nS/IZPVVU\r\nSowZD1gdaqfPyP6FOc7SVT0hnQoa1eiNWo7/9n7f5EHk8Ke327GID6prNp6iuFAO\r\nGPcEymZDojeoqRcpxKIyCqDwx2aeZS1GDMEX3idZjTLoKCX3s234nfh/geWwwtxa\r\n/cxqS3lpOCp8rRX6bec6EwKBgGayhcN3lN3+0V3MtuiLldih+RVz10fSFWJSOmu7\r\nHqzMNBcNlZ6SlCIXlxqlQGYd05Rm5l/Qstll/VpV4PhKTRjJ5tgT8uhXywVIbAXg\r\nb4jZCvpz0lON8Q8I6p1oIvJWIHXHT7WMBQcCc2xAlDLsyuCO9vVgGmIKLfGC6sj2\r\nshCJAoGBAL6FK1se6TqKsBdGPMqZTL5qbHrhDBeTZFVThank6Yji80jKjouLYMTK\r\nTLsu5zSvOPiDsHjYASNs4s0Hluw7OY/i4UdhoAJ5Zqy+yjtWL1ZPZueHVSse41Ip\r\n+q5VeW6LUnVxdF20RQA/S5sbcut0NTB7pjZi7YlmwksywFZooSSz\r\n-----END RSA PRIVATE KEY-----\r\n',
  },
  type: 'rsa',
  curStatus: {
    status: 'new',
    date: 1710399425273.0,
  },
  statusList: [
    {
      status: 'new',
      date: 1710399425273.0,
    },
  ],
  createdAt: 1710399425273.0,
  updatedAt: 1710399425273.0,
};

describe('SurveyResponseController', () => {
  let controller: SurveyResponseController;
  let responseSchemaService: ResponseSchemaService;
  let surveyResponseService: SurveyResponseService;
  let clientEncryptService: ClientEncryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyResponseController],
      providers: [
        {
          provide: ResponseSchemaService,
          useValue: {
            getResponseSchemaByPath: jest.fn(),
          },
        },
        {
          provide: CounterService,
          useValue: {
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn(),
          },
        },
        {
          provide: SurveyResponseService,
          useValue: {
            getSurveyResponseTotalByPath: jest.fn(),
            createSurveyResponse: jest.fn(),
          },
        },
        {
          provide: ClientEncryptService,
          useValue: {
            deleteEncryptInfo: jest.fn(),
            getEncryptInfoById: jest
              .fn()
              .mockResolvedValue(mockClientEncryptInfo),
          },
        },
        PluginManagerProvider,
        {
          provide: MessagePushingTaskService,
          useValue: {
            runResponseDataPush: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
            info: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUserByUsername: jest.fn(),
          },
        },
        {
          provide: WorkspaceMemberService,
          useValue: {
            findAllByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SurveyResponseController>(SurveyResponseController);
    responseSchemaService = module.get<ResponseSchemaService>(
      ResponseSchemaService,
    );
    surveyResponseService = module.get<SurveyResponseService>(
      SurveyResponseService,
    );
    clientEncryptService =
      module.get<ClientEncryptService>(ClientEncryptService);

    const pluginManager = module.get<PluginManager>(PluginManager);
    pluginManager.registerPlugin(
      new ResponseSecurityPlugin('dataAesEncryptSecretKey'),
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createResponse', () => {
    it('should create response successfully', async () => {
      const reqBody = cloneDeep(mockSubmitData);

      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPath')
        .mockResolvedValueOnce(mockResponseSchema);
      jest
        .spyOn(surveyResponseService, 'getSurveyResponseTotalByPath')
        .mockResolvedValueOnce(0);
      jest
        .spyOn(surveyResponseService, 'createSurveyResponse')
        .mockResolvedValueOnce({
          _id: new ObjectId('65fc2dd77f4520858046e129'),
          clientTime: 1711025112552,
          createdAt: 1711025113146,
          curStatus: {
            status: RECORD_STATUS.NEW,
            date: 1711025113146,
          },
          diffTime: 30518,
          data: {
            data458: '15000000000',
            data515: '115019',
            data450: '450111000000000000',
            data405: '浙江省杭州市西湖区xxx',
            data770: '123456@qq.com',
          },
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
          },
          pageId: '65f29f3192862d6a9067ad1c',
          statusList: [
            {
              status: RECORD_STATUS.NEW,
              date: 1711025113146,
            },
          ],

          surveyPath: 'EBzdmnSp',
          updatedAt: 1711025113146,
          secretKeys: [],
        } as unknown as SurveyResponse);
      jest
        .spyOn(clientEncryptService, 'deleteEncryptInfo')
        .mockResolvedValueOnce(undefined);

      const result = await controller.createResponse(reqBody);

      expect(result).toEqual({ code: 200, msg: '提交成功' });
      expect(
        responseSchemaService.getResponseSchemaByPath,
      ).toHaveBeenCalledWith(reqBody.surveyPath);
      expect(
        surveyResponseService.getSurveyResponseTotalByPath,
      ).toHaveBeenCalledWith(reqBody.surveyPath);
      expect(surveyResponseService.createSurveyResponse).toHaveBeenCalledWith({
        surveyPath: reqBody.surveyPath,
        data: {
          data405: '浙江省杭州市西湖区xxx',
          data450: '450111000000000000',
          data458: '15000000000',
          data515: '115019',
          data770: '123456@qq.com',
        },
        clientTime: reqBody.clientTime,
        diffTime: reqBody.diffTime,
        surveyId: mockResponseSchema.pageId,
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
        },
      });

      expect(clientEncryptService.deleteEncryptInfo).toHaveBeenCalledWith(
        reqBody.sessionId,
      );
    });

    it('should throw SurveyNotFoundException if survey does not exist', async () => {
      const reqBody = cloneDeep(mockSubmitData);

      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPath')
        .mockResolvedValueOnce(null);

      await expect(controller.createResponse(reqBody)).rejects.toThrow(
        SurveyNotFoundException,
      );
    });

    it('should throw HttpException if no sign', async () => {
      const reqBody = cloneDeep(mockSubmitData);
      delete reqBody.sign;

      await expect(controller.createResponse(reqBody)).rejects.toThrow(
        HttpException,
      );

      expect(
        responseSchemaService.getResponseSchemaByPath,
      ).toHaveBeenCalledTimes(0);
    });

    it('should throw HttpException if no sign error', async () => {
      const reqBody = cloneDeep(mockDecryptErrorBody);
      reqBody.sign = 'mock sign';

      await expect(controller.createResponse(reqBody)).rejects.toThrow(
        HttpException,
      );

      expect(
        responseSchemaService.getResponseSchemaByPath,
      ).toHaveBeenCalledTimes(0);
    });

    it('should throw HttpException if answer time is invalid', async () => {
      const reqBody = { surveyPath: 'validSurveyPath' };

      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPath')
        .mockResolvedValueOnce(mockResponseSchema);

      await expect(controller.createResponse(reqBody)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw HttpException if rsa decrypt error', async () => {
      const reqBody = mockDecryptErrorBody;

      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPath')
        .mockResolvedValueOnce(mockResponseSchema);

      await expect(controller.createResponse(reqBody)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw HttpException if password does not match', async () => {
      const reqBody = {
        ...mockSubmitData,
        password: '123457',
        sign: '145595d85079af3b1fb30784177c348555f442837c051d90f57a01ce1ff53c32.1710400229589',
      };

      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPath')
        .mockResolvedValueOnce({
          curStatus: {
            status: RECORD_STATUS.PUBLISHED,
          },
          subStatus: {
            status: RECORD_SUB_STATUS.DEFAULT,
          },
          code: {
            baseConf: {
              passwordSwitch: true,
              password: '123456',
            },
          },
        } as ResponseSchema);

      await expect(controller.createResponse(reqBody)).rejects.toThrow(
        new HttpException('白名单验证失败', EXCEPTION_CODE.WHITELIST_ERROR),
      );
    });
  });
});
