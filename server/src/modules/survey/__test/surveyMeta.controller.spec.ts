import { Test, TestingModule } from '@nestjs/testing';
import { SurveyMetaController } from '../controllers/surveyMeta.controller';
import { SurveyMetaService } from '../services/surveyMeta.service';
import { Authtication } from 'src/guards/authtication';
import * as Joi from 'joi';
import { SurveyMeta } from 'src/models/surveyMeta.entity';

describe('SurveyMetaController', () => {
  let controller: SurveyMetaController;
  let surveyMetaService: SurveyMetaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyMetaController],
      providers: [
        {
          provide: SurveyMetaService,
          useValue: {
            checkSurveyAccess: jest.fn().mockResolvedValue({}),
            editSurveyMeta: jest.fn().mockResolvedValue(undefined),
            getSurveyMetaList: jest
              .fn()
              .mockResolvedValue({ count: 0, data: [] }),
          },
        },
      ],
    })
      .overrideGuard(Authtication)
      .useValue({
        canActivate: () => true,
      })
      .compile();

    controller = module.get<SurveyMetaController>(SurveyMetaController);
    surveyMetaService = module.get<SurveyMetaService>(SurveyMetaService);
  });

  it('should update survey meta', async () => {
    const reqBody = {
      remark: 'Test remark',
      title: 'Test title',
      surveyId: 'test-survey-id',
    };
    const req = {
      user: {
        username: 'test-user',
      },
    };

    const survey = {
      title: '',
      remark: '',
    };

    jest
      .spyOn(surveyMetaService, 'checkSurveyAccess')
      .mockImplementation(() => {
        return Promise.resolve(survey) as Promise<SurveyMeta>;
      });

    const result = await controller.updateMeta(reqBody, req);

    expect(surveyMetaService.checkSurveyAccess).toHaveBeenCalledWith({
      surveyId: reqBody.surveyId,
      username: req.user.username,
    });

    expect(surveyMetaService.editSurveyMeta).toHaveBeenCalledWith({
      title: reqBody.title,
      remark: reqBody.remark,
    });

    expect(result).toEqual({ code: 200 });
  });

  it('should validate request body with Joi', async () => {
    const reqBody = {
      // Missing title and surveyId
    };
    const req = {
      user: {
        username: 'test-user',
      },
    };

    try {
      await controller.updateMeta(reqBody, req);
    } catch (error) {
      expect(error).toBeInstanceOf(Joi.ValidationError);
      expect(error.details[0].message).toMatch('"title" is required');
    }

    expect(surveyMetaService.checkSurveyAccess).not.toHaveBeenCalled();
    expect(surveyMetaService.editSurveyMeta).not.toHaveBeenCalled();
  });

  it('should get survey meta list', async () => {
    const queryInfo = {
      curPage: 1,
      pageSize: 10,
    };
    const req = {
      user: {
        username: 'test-user',
      },
    };

    try {
      jest
        .spyOn(surveyMetaService, 'getSurveyMetaList')
        .mockImplementation(() => {
          const date = new Date().getTime();
          return Promise.resolve({
            count: 10,
            data: [
              {
                id: '1',
                createDate: date,
                updateDate: date,
                curStatus: {
                  date: date,
                },
              },
            ],
          });
        });

      const result = await controller.getList(queryInfo, req);

      expect(result).toEqual({
        code: 200,
        data: {
          count: 10,
          data: expect.arrayContaining([
            expect.objectContaining({
              createDate: expect.stringMatching(
                /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
              ),
              updateDate: expect.stringMatching(
                /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
              ),
              curStatus: expect.objectContaining({
                date: expect.stringMatching(
                  /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
                ),
              }),
            }),
          ]),
        },
      });
      expect(surveyMetaService.getSurveyMetaList).toHaveBeenCalledWith({
        pageNum: queryInfo.curPage,
        pageSize: queryInfo.pageSize,
        username: req.user.username,
        filter: {},
        order: {},
      });
    } catch (error) {
      console.log(error);
    }
  });

  it('should get survey meta list with filter and order', async () => {
    const queryInfo = {
      curPage: 1,
      pageSize: 10,
      filter: JSON.stringify([
        {
          comparator: '',
          condition: [{ field: 'title', value: 'hahah', comparator: '$regex' }],
        },
        {
          comparator: '',
          condition: [{ field: 'surveyType', value: 'normal' }],
        },
      ]),
      order: JSON.stringify([{ field: 'createDate', value: -1 }]),
    };
    const req = {
      user: {
        username: 'test-user',
      },
    };

    try {
      const result = await controller.getList(queryInfo, req);

      expect(result.code).toEqual(200);
      expect(surveyMetaService.getSurveyMetaList).toHaveBeenCalledWith({
        pageNum: queryInfo.curPage,
        pageSize: queryInfo.pageSize,
        username: req.user.username,
        filter: { surveyType: 'normal', title: { $regex: 'hahah' } },
        order: { createDate: -1 },
      });
    } catch (error) {
      console.log(error);
    }
  });
});
