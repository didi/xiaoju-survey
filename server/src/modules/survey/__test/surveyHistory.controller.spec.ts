import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { SurveyHistoryController } from '../controllers/surveyHistory.controller';
import { SurveyHistoryService } from '../services/surveyHistory.service';
import { SurveyMetaService } from '../services/surveyMeta.service';

import { UserService } from 'src/modules/auth/services/user.service';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { Logger } from 'src/logger';

jest.mock('src/guards/authentication.guard');
jest.mock('src/guards/survey.guard');
jest.mock('src/guards/workspace.guard');

describe('SurveyHistoryController', () => {
  let controller: SurveyHistoryController;
  let surveyHistoryService: SurveyHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyHistoryController],
      providers: [
        ConfigService,
        {
          provide: SurveyHistoryService,
          useClass: jest.fn().mockImplementation(() => ({
            getHistoryList: jest.fn().mockResolvedValue('mockHistoryList'),
          })),
        },
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
            verifyToken() {
              return {};
            },
          })),
        },
        {
          provide: SurveyMetaService,
          useClass: jest.fn().mockImplementation(() => ({})),
        },
        {
          provide: Logger,
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SurveyHistoryController>(SurveyHistoryController);
    surveyHistoryService =
      module.get<SurveyHistoryService>(SurveyHistoryService);
  });

  it('should return history list when query is valid', async () => {
    const queryInfo = { surveyId: 'survey123', historyType: 'published' };

    await controller.getList(queryInfo);

    expect(surveyHistoryService.getHistoryList).toHaveBeenCalledWith({
      surveyId: queryInfo.surveyId,
      historyType: queryInfo.historyType,
    });

    expect(surveyHistoryService.getHistoryList).toHaveBeenCalledTimes(1);
  });
});
