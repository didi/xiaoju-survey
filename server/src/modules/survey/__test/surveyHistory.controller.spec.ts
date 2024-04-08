import { Test, TestingModule } from '@nestjs/testing';
import { SurveyHistoryController } from '../controllers/surveyHistory.controller';
import { SurveyHistoryService } from '../services/surveyHistory.service';
import { SurveyMetaService } from '../services/surveyMeta.service';
import { UserService } from 'src/modules/auth/services/user.service';
import { Authtication } from 'src/guards/authtication';

import { ConfigService } from '@nestjs/config';

describe('SurveyHistoryController', () => {
  let controller: SurveyHistoryController;
  let surveyHistoryService: SurveyHistoryService;
  let surveyMetaService: SurveyMetaService;

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
          provide: SurveyMetaService,
          useClass: jest.fn().mockImplementation(() => ({
            checkSurveyAccess: jest.fn().mockResolvedValue({}),
          })),
        },
        {
          provide: Authtication,
          useClass: jest.fn().mockImplementation(() => ({
            canActivate: () => true,
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
      ],
    }).compile();

    controller = module.get<SurveyHistoryController>(SurveyHistoryController);
    surveyHistoryService =
      module.get<SurveyHistoryService>(SurveyHistoryService);
    surveyMetaService = module.get<SurveyMetaService>(SurveyMetaService);
  });

  it('should return history list when query is valid', async () => {
    const req = { user: { username: 'testUser' } };
    const queryInfo = { surveyId: 'survey123', historyType: 'published' };

    await controller.getList(queryInfo, req);

    expect(surveyMetaService.checkSurveyAccess).toHaveBeenCalledWith({
      surveyId: queryInfo.surveyId,
      username: req.user.username,
    });

    expect(surveyHistoryService.getHistoryList).toHaveBeenCalledWith({
      surveyId: queryInfo.surveyId,
      historyType: queryInfo.historyType,
    });

    expect(surveyHistoryService.getHistoryList).toHaveBeenCalledTimes(1);
    expect(surveyMetaService.checkSurveyAccess).toHaveBeenCalledTimes(1);
  });
});
