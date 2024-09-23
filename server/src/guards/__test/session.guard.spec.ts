import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SessionService } from 'src/modules/survey/services/session.service';
import { SessionGuard } from '../session.guard';
import { NoPermissionException } from 'src/exceptions/noPermissionException';

describe('SessionGuard', () => {
  let sessionGuard: SessionGuard;
  let reflector: Reflector;
  let sessionService: SessionService;

  beforeEach(() => {
    reflector = new Reflector();
    sessionService = {
      findOne: jest.fn(),
    } as unknown as SessionService;
    sessionGuard = new SessionGuard(reflector, sessionService);
  });

  it('should return true when sessionId exists and sessionService returns sessionInfo', async () => {
    const mockSessionId = '12345';
    const mockSessionInfo = { id: mockSessionId, name: 'test session' };

    const context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        sessionId: mockSessionId,
      }),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue('sessionId');

    jest
      .spyOn(sessionService, 'findOne')
      .mockResolvedValue(mockSessionInfo as any);

    const result = await sessionGuard.canActivate(context);

    const request = context.switchToHttp().getRequest();

    expect(result).toBe(true);
    expect(reflector.get).toHaveBeenCalledWith(
      'sessionId',
      context.getHandler(),
    );
    expect(sessionService.findOne).toHaveBeenCalledWith(mockSessionId);
    expect(request.sessionInfo).toEqual(mockSessionInfo);
  });

  it('should throw NoPermissionException when sessionId is missing', async () => {
    const context = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({}),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue('sessionId');

    await expect(sessionGuard.canActivate(context)).rejects.toThrow(
      NoPermissionException,
    );
    expect(reflector.get).toHaveBeenCalledWith(
      'sessionId',
      context.getHandler(),
    );
  });
});
