import { Test, TestingModule } from '@nestjs/testing';
import { ResponseSchemaController } from '../controllers/responseSchema.controller';
import { ResponseSchemaService } from '../services/responseScheme.service';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { RECORD_STATUS } from 'src/enums';

import { ResponseSchema } from 'src/models/responseSchema.entity';
import { Logger } from 'src/logger';
import { UserService } from 'src/modules/auth/services/user.service';
import { WorkspaceMemberService } from 'src/modules/workspace/services/workspaceMember.service';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { SurveyNotFoundException } from 'src/exceptions/surveyNotFoundException';

jest.mock('../services/responseScheme.service');

describe('ResponseSchemaController', () => {
  let controller: ResponseSchemaController;
  let responseSchemaService: ResponseSchemaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResponseSchemaController],
      providers: [
        ResponseSchemaService,
        AuthService,
        {
          provide: Logger,
          useValue: {
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
        {
          provide: AuthService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
          },
        },
      ],
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

    it('whitelistValidate should throw SurveyNotFoundException when survey is removed', async () => {
      const surveyPath = '';
      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPath')
        .mockResolvedValue(null);
      await expect(
        controller.whitelistValidate(surveyPath, {
          password: '123456',
        }),
      ).rejects.toThrow(new SurveyNotFoundException('该问卷不存在,无法提交'));
    });

    it('whitelistValidate should throw WHITELIST_ERROR code when password is incorrect', async () => {
      const surveyPath = '';
      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPath')
        .mockResolvedValue({
          curStatus: {
            status: 'published',
          },
          code: {
            baseConf: {
              passwordSwitch: true,
              password: '123456',
            },
          },
        } as ResponseSchema);
      await expect(
        controller.whitelistValidate(surveyPath, {
          password: '123457',
        }),
      ).rejects.toThrow(
        new HttpException('验证失败', EXCEPTION_CODE.WHITELIST_ERROR),
      );
    });

    it('whitelistValidate should be successfully', async () => {
      const surveyPath = 'test';
      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPath')
        .mockResolvedValue({
          curStatus: {
            status: 'published',
          },
          code: {
            baseConf: {
              passwordSwitch: true,
              password: '123456',
            },
          },
        } as ResponseSchema);

      await expect(
        controller.whitelistValidate(surveyPath, {
          password: '123456',
        }),
      ).resolves.toEqual({ code: 200, data: null });
    });

    it('whitelistValidate should throw WHITELIST_ERROR code when mobile or email is incorrect', async () => {
      const surveyPath = '';
      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPath')
        .mockResolvedValue({
          curStatus: {
            status: 'published',
          },
          code: {
            baseConf: {
              passwordSwitch: true,
              password: '123456',
              whitelistType: 'CUSTOM',
              memberType: 'MOBILE',
              whitelist: ['13500000000'],
            },
          },
        } as ResponseSchema);
      await expect(
        controller.whitelistValidate(surveyPath, {
          password: '123456',
          whitelist: '13500000001',
        }),
      ).rejects.toThrow(
        new HttpException('验证失败', EXCEPTION_CODE.WHITELIST_ERROR),
      );
    });

    it('whitelistValidate should throw WHITELIST_ERROR code when member is incorrect', async () => {
      const surveyPath = '';
      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPath')
        .mockResolvedValue({
          curStatus: {
            status: 'published',
          },
          code: {
            baseConf: {
              passwordSwitch: true,
              password: '123456',
              whitelistType: 'MEMBER',
              whitelist: ['Jack'],
            },
          },
        } as ResponseSchema);
      await expect(
        controller.whitelistValidate(surveyPath, {
          password: '123456',
          whitelist: 'James',
        }),
      ).rejects.toThrow(
        new HttpException('验证失败', EXCEPTION_CODE.WHITELIST_ERROR),
      );
    });
  });

  it('whitelistValidate should return verifyId successfully', async () => {
    const surveyPath = '';
    jest
      .spyOn(responseSchemaService, 'getResponseSchemaByPath')
      .mockResolvedValue({
        curStatus: {
          status: 'published',
        },
        code: {
          baseConf: {
            passwordSwitch: true,
            password: '123456',
            whitelistType: 'CUSTOM',
            memberType: 'MOBILE',
            whitelist: ['13500000000'],
          },
        },
      } as ResponseSchema);

    await expect(
      controller.whitelistValidate(surveyPath, {
        password: '123456',
        whitelist: '13500000000',
      }),
    ).resolves.toEqual({ code: 200, data: null });
  });
});
