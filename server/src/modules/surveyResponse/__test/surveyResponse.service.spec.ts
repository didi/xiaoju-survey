import { Test, TestingModule } from '@nestjs/testing';
import { SurveyResponseService } from '../services/surveyResponse.service';
import { MongoRepository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SurveyResponse } from 'src/models/surveyResponse.entity';

describe('SurveyResponseService', () => {
  let service: SurveyResponseService;
  let surveyResponseRepository: MongoRepository<SurveyResponse>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyResponseService,
        {
          provide: getRepositoryToken(SurveyResponse),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            count: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SurveyResponseService>(SurveyResponseService);
    surveyResponseRepository = module.get<MongoRepository<SurveyResponse>>(
      getRepositoryToken(SurveyResponse),
    );
  });

  it('should create a survey response', async () => {
    const surveyData = {
      data: {},
      clientTime: new Date(),
      diffTime: 0,
      surveyId: 'testId',
      surveyPath: 'testPath',
      optionTextAndId: {},
    };
    jest
      .spyOn(surveyResponseRepository, 'create')
      .mockImplementation((data) => {
        const surveyResponse = new SurveyResponse();
        for (const key in data) {
          surveyResponse[key] = data[key];
        }
        return surveyResponse;
      });
    jest
      .spyOn(surveyResponseRepository, 'save')
      .mockImplementation((surveyResponse: SurveyResponse) => {
        return Promise.resolve(surveyResponse);
      });

    await service.createSurveyResponse(surveyData);

    expect(surveyResponseRepository.create).toHaveBeenCalledWith({
      surveyPath: surveyData.surveyPath,
      data: surveyData.data,
      clientTime: surveyData.clientTime,
      diffTime: surveyData.diffTime,
      pageId: surveyData.surveyId,
      secretKeys: [],
      optionTextAndId: surveyData.optionTextAndId,
    });
  });

  it('should get the total survey response count by path', async () => {
    const surveyPath = 'testPath';
    const count = 10;
    jest
      .spyOn(surveyResponseRepository, 'find')
      .mockResolvedValue(new Array(10));

    const result = await service.getSurveyResponseTotalByPath(surveyPath);

    expect(result).toEqual(count);
  });
});
