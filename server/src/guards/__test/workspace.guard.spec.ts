import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';

import { WorkspaceGuard } from '../workspace.guard';
import { WorkspaceMemberService } from 'src/modules/workspace/services/workspaceMember.service';
import { NoPermissionException } from '../../exceptions/noPermissionException';
import { WorkspaceMember } from 'src/models/workspaceMember.entity';

import { PERMISSION as WORKSPACE_PERMISSION } from 'src/enums/workspace';

describe('WorkspaceGuard', () => {
  let guard: WorkspaceGuard;
  let reflector: Reflector;
  let workspaceMemberService: WorkspaceMemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspaceGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
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

    guard = module.get<WorkspaceGuard>(WorkspaceGuard);
    reflector = module.get<Reflector>(Reflector);
    workspaceMemberService = module.get<WorkspaceMemberService>(
      WorkspaceMemberService,
    );
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if no roles are defined', async () => {
    const context = createMockExecutionContext();
    jest.spyOn(reflector, 'get').mockReturnValue(null);

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should throw NoPermissionException if workspaceId is missing and optional is false', async () => {
    const context = createMockExecutionContext();
    jest
      .spyOn(reflector, 'get')
      .mockReturnValueOnce([WORKSPACE_PERMISSION.READ_WORKSPACE]);
    jest.spyOn(reflector, 'get').mockReturnValueOnce('params.workspaceId');

    await expect(guard.canActivate(context)).rejects.toThrow(
      NoPermissionException,
    );
  });

  it('should allow access if workspaceId is missing and optional is true', async () => {
    const context = createMockExecutionContext();
    jest
      .spyOn(reflector, 'get')
      .mockReturnValueOnce([WORKSPACE_PERMISSION.WRITE_WORKSPACE]);
    jest
      .spyOn(reflector, 'get')
      .mockReturnValueOnce({ key: 'params.workspaceId', optional: true });

    jest
      .spyOn(workspaceMemberService, 'findOne')
      .mockResolvedValue({ role: 'admin' } as WorkspaceMember);

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should throw NoPermissionException if user is not a member of the workspace', async () => {
    const context = createMockExecutionContext();
    jest
      .spyOn(reflector, 'get')
      .mockReturnValueOnce([WORKSPACE_PERMISSION.WRITE_WORKSPACE]);
    jest.spyOn(reflector, 'get').mockReturnValueOnce('params.workspaceId');
    jest.spyOn(workspaceMemberService, 'findOne').mockResolvedValue(null);

    await expect(guard.canActivate(context)).rejects.toThrow(
      NoPermissionException,
    );
  });

  it('should throw NoPermissionException if user role is not allowed', async () => {
    const context = createMockExecutionContext();
    jest
      .spyOn(reflector, 'get')
      .mockReturnValueOnce([WORKSPACE_PERMISSION.READ_MEMBER]);
    jest.spyOn(reflector, 'get').mockReturnValueOnce('params.workspaceId');
    jest
      .spyOn(workspaceMemberService, 'findOne')
      .mockResolvedValue({ role: 'member' } as WorkspaceMember);

    await expect(guard.canActivate(context)).rejects.toThrow(
      NoPermissionException,
    );
  });

  it('should allow access if user role is allowed', async () => {
    const context = createMockExecutionContext();
    jest
      .spyOn(reflector, 'get')
      .mockReturnValueOnce([WORKSPACE_PERMISSION.READ_MEMBER]);
    jest.spyOn(reflector, 'get').mockReturnValueOnce('params.workspaceId');
    jest
      .spyOn(workspaceMemberService, 'findOne')
      .mockResolvedValue({ role: 'admin' } as WorkspaceMember);

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  function createMockExecutionContext(): ExecutionContext {
    return {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { _id: 'testUserId' },
          params: { workspaceId: 'workspaceId' },
        }),
      }),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;
  }
});
