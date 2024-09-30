import { Test, TestingModule } from '@nestjs/testing';
import { SurveyHistoryService } from '../services/surveyHistory.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { SurveyHistory } from 'src/models/surveyHistory.entity';
import { HISTORY_TYPE } from 'src/enums';
import { SurveySchemaInterface } from 'src/interfaces/survey';
import { ObjectId } from 'mongodb';

describe('SurveyHistoryService', () => {
  let service: SurveyHistoryService;
  let repository: MongoRepository<SurveyHistory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyHistoryService,
        {
          provide: getRepositoryToken(SurveyHistory),
          useClass: MongoRepository,
        },
      ],
    }).compile();

    service = module.get<SurveyHistoryService>(SurveyHistoryService);
    repository = module.get<MongoRepository<SurveyHistory>>(
      getRepositoryToken(SurveyHistory),
    );
  });

  const mockSchema: SurveySchemaInterface = {
    bannerConf: {
      titleConfig: undefined,
      bannerConfig: undefined,
    },
    dataConf: {
      dataList: [],
    },
    submitConf: {
      submitTitle: '',
      confirmAgain: undefined,
      msgContent: undefined,
    },
    baseConf: {
      beginTime: '',
      endTime: '',
      answerBegTime: '',
      answerEndTime: '',
      tLimit: 0,
      language: '',
    },
    skinConf: undefined,
    bottomConf: undefined,
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addHistory', () => {
    it('should add a new history record', async () => {
      const surveyId = 'survey_id';
      const schema = mockSchema;
      const type = HISTORY_TYPE.DAILY_HIS;
      const user = { _id: 'user_id', username: 'test_user' };

      const spyCreate = jest.spyOn(repository, 'create').mockReturnValueOnce({
        pageId: surveyId,
        type,
        schema,
        operator: {
          _id: user._id.toString(),
          username: user.username,
        },
      } as SurveyHistory);

      const spySave = jest
        .spyOn(repository, 'save')
        .mockResolvedValueOnce({} as SurveyHistory);

      await service.addHistory({
        surveyId,
        schema,
        type,
        user,
      });

      expect(spyCreate).toHaveBeenCalledWith({
        pageId: surveyId,
        type,
        schema,
        operator: {
          _id: user._id.toString(),
          username: user.username,
        },
      });
      expect(spySave).toHaveBeenCalled();
    });
  });

  describe('getHistoryList', () => {
    it('should return a list of history records for a survey', async () => {
      const surveyId = new ObjectId().toString();
      const historyType = HISTORY_TYPE.DAILY_HIS;
      const mockHistory = new SurveyHistory();
      mockHistory.schema = mockSchema;
      mockHistory.pageId = surveyId;
      const expectedResult = [mockHistory];

      const spyFind = jest
        .spyOn(repository, 'find')
        .mockResolvedValueOnce(expectedResult);

      const result = await service.getHistoryList({ surveyId, historyType });

      expect(result).toEqual(expectedResult);
      expect(spyFind).toHaveBeenCalledWith({
        where: {
          pageId: surveyId,
          type: historyType,
        },
        take: 100,
        order: {
          createdAt: -1,
        },
        select: ['createdAt', 'operator', 'type', '_id'],
      });
    });
  });
});
