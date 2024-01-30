import { Test, TestingModule } from '@nestjs/testing';
import { ResponseSchemaController } from '../controllers/responseSchema.controller';
import { ResponseSchemaService } from '../services/responseScheme.service';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { RECORD_STATUS } from 'src/enums';

import { ResponseSchema } from 'src/models/responseSchema.entity';

jest.mock('../services/responseScheme.service');

describe('ResponseSchemaController', () => {
  let controller: ResponseSchemaController;
  let responseSchemaService: ResponseSchemaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResponseSchemaController],
      providers: [ResponseSchemaService],
    }).compile();

    controller = module.get<ResponseSchemaController>(ResponseSchemaController);
    responseSchemaService = module.get<ResponseSchemaService>(
      ResponseSchemaService,
    );
  });

  describe('getSchema', () => {
    it('should return response schema when surveyPath is provided and valid', async () => {
      const mockQueryInfo = { surveyPath: 'validSurveyPath' };
      const mockResponseSchema = {
        surveyPath: 'testSurveyPath',
        curStatus: { status: RECORD_STATUS.PUBLISHED, date: Date.now() },
      } as ResponseSchema;

      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPath')
        .mockResolvedValue(Promise.resolve(mockResponseSchema));

      const result = await controller.getSchema(mockQueryInfo);

      expect(result).toEqual({
        code: 200,
        data: mockResponseSchema,
      });
    });

    it('should throw HttpException with PARAMETER_ERROR code when surveyPath is missing', async () => {
      const mockQueryInfo = { surveyPath: '' };

      await expect(controller.getSchema(mockQueryInfo)).rejects.toThrow(
        new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR),
      );
    });

    it('should throw HttpException with RESPONSE_SCHEMA_REMOVED code when survey is removed', async () => {
      const mockQueryInfo = { surveyPath: 'removedSurveyPath' };

      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPath')
        .mockResolvedValue({
          curStatus: { status: RECORD_STATUS.REMOVED },
        } as ResponseSchema);

      await expect(controller.getSchema(mockQueryInfo)).rejects.toThrow(
        new HttpException('问卷已删除', EXCEPTION_CODE.RESPONSE_SCHEMA_REMOVED),
      );
    });
  });
});
