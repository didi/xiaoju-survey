import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { get } from 'lodash';
import { NoPermissionException } from 'src/exceptions/noPermissionException';
import { SessionService } from 'src/modules/survey/services/session.service';
@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sessionIdKey = this.reflector.get<string>(
      'sessionId',
      context.getHandler(),
    );

    const sessionId = get(request, sessionIdKey);

    if (!sessionId) {
      throw new NoPermissionException('没有权限');
    }
    const sessionInfo = await this.sessionService.findOne(sessionId);
    request.sessionInfo = sessionInfo;
    request.surveyId = sessionInfo.surveyId;
    return true;
  }
}
