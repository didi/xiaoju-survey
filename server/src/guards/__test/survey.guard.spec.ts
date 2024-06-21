import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';

import { SurveyGuard } from '../survey.guard';
import { WorkspaceMemberService } from 'src/modules/workspace/services/workspaceMember.service';
import { CollaboratorService } from 'src/modules/survey/services/collaborator.service';
import { SurveyMetaService } from 'src/modules/survey/services/surveyMeta.service';
import { SurveyNotFoundException } from 'src/exceptions/surveyNotFoundException';
import { NoPermissionException } from 'src/exceptions/noPermissionException';
import { SurveyMeta } from 'src/models/surveyMeta.entity';
import { WorkspaceMember } from 'src/models/workspaceMember.entity';
import { Collaborator } from 'src/models/collaborator.entity';
import { SURVEY_PERMISSION } from 'src/enums/surveyPermission';

describe('SurveyGuard', () => {
  let guard: SurveyGuard;
  let reflector: Reflector;
  let collaboratorService: CollaboratorService;
  let surveyMetaService: SurveyMetaService;
  let workspaceMemberService: WorkspaceMemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: CollaboratorService,
          useValue: {
            getCollaborator: jest.fn(),
          },
        },
        {
          provide: SurveyMetaService,
          useValue: {
            getSurveyById: jest.fn(),
          },
        },
        {
          provide: WorkspaceMemberService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<SurveyGuard>(SurveyGuard);
    reflector = module.get<Reflector>(Reflector);
    collaboratorService = module.get<CollaboratorService>(CollaboratorService);
    surveyMetaService = module.get<SurveyMetaService>(SurveyMetaService);
    workspaceMemberService = module.get<WorkspaceMemberService>(
      WorkspaceMemberService,
    );
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if no surveyId is present', async () => {
    const context = createMockExecutionContext();
    jest.spyOn(reflector, 'get').mockReturnValue(null);

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should throw SurveyNotFoundException if survey does not exist', async () => {
    const context = createMockExecutionContext();
    jest.spyOn(reflector, 'get').mockReturnValue('params.surveyId');
    jest.spyOn(surveyMetaService, 'getSurveyById').mockResolvedValue(null);

    await expect(guard.canActivate(context)).rejects.toThrow(
      SurveyNotFoundException,
    );
  });

  it('should allow access if user is the owner of the survey by ownerId', async () => {
    const context = createMockExecutionContext();
    const surveyMeta = { ownerId: 'testUserId', workspaceId: null };
    jest.spyOn(reflector, 'get').mockReturnValue('params.surveyId');
    jest
      .spyOn(surveyMetaService, 'getSurveyById')
      .mockResolvedValue(surveyMeta as SurveyMeta);

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should allow access if user is the owner of the survey by username', async () => {
    const context = createMockExecutionContext();
    const surveyMeta = { owner: 'testUser', workspaceId: null };
    jest.spyOn(reflector, 'get').mockReturnValue('params.surveyId');
    jest
      .spyOn(surveyMetaService, 'getSurveyById')
      .mockResolvedValue(surveyMeta as SurveyMeta);

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should allow access if user is a workspace member', async () => {
    const context = createMockExecutionContext();
    const surveyMeta = { owner: 'anotherUser', workspaceId: 'workspaceId' };
    jest.spyOn(reflector, 'get').mockReturnValue('params.surveyId');
    jest
      .spyOn(surveyMetaService, 'getSurveyById')
      .mockResolvedValue(surveyMeta as SurveyMeta);
    jest
      .spyOn(workspaceMemberService, 'findOne')
      .mockResolvedValue({} as WorkspaceMember);

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should throw NoPermissionException if user is not a workspace member', async () => {
    const context = createMockExecutionContext();
    const surveyMeta = { owner: 'anotherUser', workspaceId: 'workspaceId' };
    jest.spyOn(reflector, 'get').mockReturnValue('params.surveyId');
    jest
      .spyOn(surveyMetaService, 'getSurveyById')
      .mockResolvedValue(surveyMeta as SurveyMeta);
    jest.spyOn(workspaceMemberService, 'findOne').mockResolvedValue(null);

    await expect(guard.canActivate(context)).rejects.toThrow(
      NoPermissionException,
    );
  });

  it('should throw NoPermissionException if no permissions are provided', async () => {
    const context = createMockExecutionContext();
    const surveyMeta = { owner: 'anotherUser', workspaceId: null };
    jest.spyOn(reflector, 'get').mockReturnValueOnce('params.surveyId');
    jest.spyOn(reflector, 'get').mockReturnValueOnce(null);
    jest
      .spyOn(surveyMetaService, 'getSurveyById')
      .mockResolvedValue(surveyMeta as SurveyMeta);

    await expect(guard.canActivate(context)).rejects.toThrow(
      NoPermissionException,
    );
  });

  it('should throw NoPermissionException if user has no matching permissions', async () => {
    const context = createMockExecutionContext();
    const surveyMeta = { owner: 'anotherUser', workspaceId: null };
    jest.spyOn(reflector, 'get').mockReturnValueOnce('params.surveyId');
    jest.spyOn(reflector, 'get').mockReturnValueOnce(['requiredPermission']);
    jest
      .spyOn(surveyMetaService, 'getSurveyById')
      .mockResolvedValue(surveyMeta as SurveyMeta);
    jest
      .spyOn(collaboratorService, 'getCollaborator')
      .mockResolvedValue({ permissions: [] } as Collaborator);

    await expect(guard.canActivate(context)).rejects.toThrow(
      NoPermissionException,
    );
  });

  it('should allow access if user has the required permissions', async () => {
    const context = createMockExecutionContext();
    const surveyMeta = { owner: 'anotherUser', workspaceId: null };
    jest.spyOn(reflector, 'get').mockReturnValueOnce('params.surveyId');
    jest
      .spyOn(reflector, 'get')
      .mockReturnValueOnce([SURVEY_PERMISSION.SURVEY_CONF_MANAGE]);
    jest
      .spyOn(surveyMetaService, 'getSurveyById')
      .mockResolvedValue(surveyMeta as SurveyMeta);
    jest.spyOn(collaboratorService, 'getCollaborator').mockResolvedValue({
      permissions: [SURVEY_PERMISSION.SURVEY_CONF_MANAGE],
    } as Collaborator);

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  function createMockExecutionContext(): ExecutionContext {
    return {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { username: 'testUser', _id: 'testUserId' },
          params: { surveyId: 'surveyId' },
        }),
      }),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;
  }
});
