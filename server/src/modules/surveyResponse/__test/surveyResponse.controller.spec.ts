import { Test, TestingModule } from '@nestjs/testing';
import { SurveyResponseController } from '../controllers/surveyResponse.controller';
import { ResponseSchemaService } from '../services/responseScheme.service';
import { CounterService } from '../services/counter.service';
import { SurveyResponseService } from '../services/surveyResponse.service';
import { ClientEncryptService } from '../services/clientEncrypt.service';
import { SurveyNotFoundException } from 'src/exceptions/surveyNotFoundException';

import { ResponseSchema } from 'src/models/responseSchema.entity';
import { ClientEncrypt } from 'src/models/clientEncrypt.entity';
import { RECORD_STATUS } from 'src/enums';

import * as aes from 'crypto-js/aes';

jest.mock('../services/responseScheme.service');
jest.mock('../services/counter.service');
jest.mock('../services/surveyResponse.service');
jest.mock('../services/clientEncrypt.service');
jest.mock('src/utils/checkSign');
jest.mock('crypto-js/aes');

describe('SurveyResponseController', () => {
  let controller: SurveyResponseController;
  let responseSchemaService: ResponseSchemaService;
  let clientEncryptService: ClientEncryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyResponseController],
      providers: [
        ResponseSchemaService,
        CounterService,
        SurveyResponseService,
        ClientEncryptService,
      ],
    }).compile();

    controller = module.get<SurveyResponseController>(SurveyResponseController);
    responseSchemaService = module.get<ResponseSchemaService>(
      ResponseSchemaService,
    );
    clientEncryptService =
      module.get<ClientEncryptService>(ClientEncryptService);
  });

  describe('createResponse', () => {
    it('should create survey response successfully with valid parameters', async () => {
      const mockReqBody = {
        surveyPath: '5q1PbCtvPM',
        data: '%7B%22data458%22%3A%22111%22%2C%22data515%22%3A%22xhfudsdg%22%7D',
        difTime: 5687,
        clientTime: 1706103961153,
        encryptType: 'aes',
        sessionId: '65b11493e8df57de0ff04c98',
        sign: 'c7ca1a8217a9ef0f4c4ed58701899603ce446353784a22c35774240f4cf4c5a4.1706103961154',
      };
      const mockResponseSchema = {
        curStatus: { status: RECORD_STATUS.PUBLISHED, date: Date.now() },
        code: {
          dataConf: {
            dataList: [],
          },
        },
      };
      const mockClientEncryptData = {
        data: {
          secretKey: 'testSecretKey',
        },
      };

      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPath')
        .mockResolvedValue(mockResponseSchema as ResponseSchema);
      jest
        .spyOn(clientEncryptService, 'getEncryptInfoById')
        .mockResolvedValue(mockClientEncryptData as ClientEncrypt);

      jest.spyOn(aes, 'decrypt').mockImplementation((data) => data);

      const result = await controller.createResponse(mockReqBody);

      expect(result).toEqual({
        code: 200,
        msg: '提交成功',
      });
    });

    it('should throw SurveyNotFoundException when response schema is not found', async () => {
      const mockReqBody = {
        surveyPath: '5q1PbCtvPM',
        data: '%7B%22data458%22%3A%22111%22%2C%22data515%22%3A%22xhfudsdg%22%7D',
        encryptType: 'validEncryptType',
        sessionId: 'validSessionId',
        clientTime: 123456789,
        difTime: 0,
      };

      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPath')
        .mockResolvedValue(null);

      await expect(controller.createResponse(mockReqBody)).rejects.toThrow(
        new SurveyNotFoundException('该问卷不存在,无法提交'),
      );
    });
  });
});
