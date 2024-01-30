import { Test, TestingModule } from '@nestjs/testing';
import { CounterController } from '../controllers/counter.controller';
import { CounterService } from '../services/counter.service';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';

jest.mock('../services/counter.service');

describe('CounterController', () => {
  let controller: CounterController;
  let counterService: CounterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CounterController],
      providers: [CounterService],
    }).compile();

    controller = module.get<CounterController>(CounterController);
    counterService = module.get<CounterService>(CounterService);
  });

  describe('queryOptionCountInfo', () => {
    it('should return vote count information when surveyPath and fieldList are provided', async () => {
      const mockQueryInfo = {
        surveyPath: 'validSurveyPath',
        fieldList: 'field1,field2',
      };
      const mockVoteData = {
        data558: { '330916': 2, '528834': 1, total: 3 },
      };

      jest.spyOn(counterService, 'getAll').mockResolvedValue(mockVoteData);

      const result = await controller.queryOptionCountInfo(mockQueryInfo);

      expect(result).toEqual({
        code: 200,
        data: mockVoteData,
      });
    });

    it('should throw HttpException with PARAMETER_ERROR code when surveyPath is missing', async () => {
      const mockQueryInfo = { surveyPath: '', fieldList: 'field1,field2' };

      await expect(
        controller.queryOptionCountInfo(mockQueryInfo),
      ).rejects.toThrow(
        new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR),
      );
    });

    it('should throw HttpException with PARAMETER_ERROR code when fieldList is missing', async () => {
      const mockQueryInfo = { surveyPath: 'validSurveyPath', fieldList: '' };

      await expect(
        controller.queryOptionCountInfo(mockQueryInfo),
      ).rejects.toThrow(
        new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR),
      );
    });
  });
});
