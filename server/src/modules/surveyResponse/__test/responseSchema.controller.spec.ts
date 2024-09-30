import { Test, TestingModule } from '@nestjs/testing';
import { ResponseSchemaController } from '../controllers/responseSchema.controller';
import { ResponseSchemaService } from '../services/responseScheme.service';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { RECORD_SUB_STATUS } from 'src/enums';
import { ResponseSchema } from 'src/models/responseSchema.entity';
import { Logger } from 'src/logger';
import { UserService } from 'src/modules/auth/services/user.service';
import { WorkspaceMemberService } from 'src/modules/workspace/services/workspaceMember.service';
import { SurveyNotFoundException } from 'src/exceptions/surveyNotFoundException';

jest.mock('../services/responseScheme.service');
jest.mock('src/modules/auth/services/user.service');
jest.mock('src/modules/workspace/services/workspaceMember.service');

describe('ResponseSchemaController', () => {
  let controller: ResponseSchemaController;
  let responseSchemaService: ResponseSchemaService;
  let userService: UserService;
  let workspaceMemberService: WorkspaceMemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResponseSchemaController],
      providers: [
        ResponseSchemaService,
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
    userService = module.get<UserService>(UserService);
    workspaceMemberService = module.get<WorkspaceMemberService>(
      WorkspaceMemberService,
    );
  });

  describe('getSchema', () => {
    it('should return response schema when surveyPath is provided and valid', async () => {
      const mockQueryInfo = { surveyPath: 'validSurveyPath' };
      const mockResponseSchema = {
        surveyPath: 'testSurveyPath',
        curStatus: { status: 'published', date: Date.now() },
        subStatus: { status: RECORD_SUB_STATUS.DEFAULT, date: Date.now() },
        code: {
          baseConf: {
            passwordSwitch: false,
            password: null,
            whitelist: [],
          },
        },
      } as ResponseSchema;

      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPath')
        .mockResolvedValue(mockResponseSchema);

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
          isDeleted: true,
        } as ResponseSchema);

      await expect(controller.getSchema(mockQueryInfo)).rejects.toThrow(
        new HttpException(
          '问卷不存在或已删除',
          EXCEPTION_CODE.RESPONSE_SCHEMA_REMOVED,
        ),
      );
    });

    it('should throw HttpException with RESPONSE_PAUSING code when survey is paused', async () => {
      const mockQueryInfo = { surveyPath: 'pausedSurveyPath' };

      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPath')
        .mockResolvedValue({
          curStatus: { status: 'published' },
          subStatus: { status: RECORD_SUB_STATUS.PAUSING },
        } as ResponseSchema);

      await expect(controller.getSchema(mockQueryInfo)).rejects.toThrow(
        new HttpException('该问卷已暂停回收', EXCEPTION_CODE.RESPONSE_PAUSING),
      );
    });
  });

  describe('whitelistValidate', () => {
    it('should throw HttpException when parameters are invalid', async () => {
      const surveyPath = 'testSurveyPath';
      const body = { password: 1 };

      await expect(
        controller.whitelistValidate(surveyPath, body),
      ).rejects.toThrow(HttpException);
    });

    it('should throw SurveyNotFoundException when survey is removed', async () => {
      const surveyPath = 'removedSurveyPath';
      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPath')
        .mockResolvedValue(null);

      await expect(
        controller.whitelistValidate(surveyPath, { password: '123456' }),
      ).rejects.toThrow(new SurveyNotFoundException('该问卷不存在,无法提交'));
    });

    it('should throw HttpException when password is incorrect', async () => {
      const surveyPath = 'testSurveyPath';
      const mockSchema = {
        code: {
          baseConf: {
            passwordSwitch: true,
            password: '123456',
          },
        },
      };

      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPath')
        .mockResolvedValue(mockSchema as any);

      await expect(
        controller.whitelistValidate(surveyPath, { password: 'wrongPassword' }),
      ).rejects.toThrow(
        new HttpException('密码验证失败', EXCEPTION_CODE.WHITELIST_ERROR),
      );
    });

    it('should validate successfully when password is correct', async () => {
      const surveyPath = 'testSurveyPath';
      const mockSchema = {
        code: {
          baseConf: {
            passwordSwitch: true,
            password: '123456',
            whitelistType: 'CUSTOM',
            whitelist: ['allowed@example.com'],
          },
        },
      };

      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPath')
        .mockResolvedValue(mockSchema as any);

      const result = await controller.whitelistValidate(surveyPath, {
        password: '123456',
        whitelist: 'allowed@example.com',
      });
      expect(result).toEqual({ code: 200, data: null });
    });

    it('should throw HttpException when whitelist value is not in CUSTOM whitelist', async () => {
      const surveyPath = 'testSurveyPath';
      const mockSchema = {
        code: {
          baseConf: {
            whitelistType: 'CUSTOM',
            whitelist: ['allowed@example.com'],
          },
        },
      };

      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPath')
        .mockResolvedValue(mockSchema as any);

      await expect(
        controller.whitelistValidate(surveyPath, {
          password: '123456',
          whitelist: 'notAllowed@example.com',
        }),
      ).rejects.toThrow(
        new HttpException('白名单验证失败', EXCEPTION_CODE.WHITELIST_ERROR),
      );
    });

    it('should throw HttpException when user is not found in MEMBER whitelist', async () => {
      const surveyPath = 'testSurveyPath';
      const mockSchema = {
        code: {
          baseConf: {
            whitelistType: 'MEMBER',
            whitelist: [],
          },
        },
      };

      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPath')
        .mockResolvedValue(mockSchema as any);
      jest.spyOn(userService, 'getUserByUsername').mockResolvedValue(null);

      await expect(
        controller.whitelistValidate(surveyPath, {
          password: '123456',
          whitelist: 'nonExistentUser',
        }),
      ).rejects.toThrow(
        new HttpException('名单验证失败', EXCEPTION_CODE.WHITELIST_ERROR),
      );
    });

    it('should throw HttpException when user is not a workspace member', async () => {
      const surveyPath = 'testSurveyPath';
      const mockSchema = {
        code: {
          baseConf: {
            whitelistType: 'MEMBER',
            whitelist: [],
          },
        },
      };

      jest
        .spyOn(responseSchemaService, 'getResponseSchemaByPath')
        .mockResolvedValue(mockSchema as any);
      jest
        .spyOn(userService, 'getUserByUsername')
        .mockResolvedValue({ _id: new Object(), username: '' } as any);
      jest
        .spyOn(workspaceMemberService, 'findAllByUserId')
        .mockResolvedValue([]);

      await expect(
        controller.whitelistValidate(surveyPath, {
          password: '123456',
          whitelist: 'testUser',
        }),
      ).rejects.toThrow(
        new HttpException('验证失败', EXCEPTION_CODE.WHITELIST_ERROR),
      );
    });
  });
});
