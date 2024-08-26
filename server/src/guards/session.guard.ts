import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { get } from 'lodash';
import { NoPermissionException } from 'src/exceptions/noPermissionException';
import { SurveyNotFoundException } from 'src/exceptions/surveyNotFoundException';
import { SessionService } from 'src/modules/survey/services/session.service';
import { SurveyMetaService } from 'src/modules/survey/services/surveyMeta.service';
import { WorkspaceMemberService } from 'src/modules/workspace/services/workspaceMember.service';
import { CollaboratorService } from 'src/modules/survey/services/collaborator.service';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly sessionService: SessionService,
    private readonly surveyMetaService: SurveyMetaService,
    private readonly workspaceMemberService: WorkspaceMemberService,
    private readonly collaboratorService: CollaboratorService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const sessionIdKey = this.reflector.get<string>(
      'sessionId',
      context.getHandler(),
    );

    const sessionId = get(request, sessionIdKey);

    if (!sessionId) {
      throw new NoPermissionException('没有权限');
    }

    const saveSession = await this.sessionService.findOne(sessionId);

    request.saveSession = saveSession;

    const surveyId = saveSession.surveyId;

    const surveyMeta = await this.surveyMetaService.getSurveyById({ surveyId });

    if (!surveyMeta) {
      throw new SurveyNotFoundException('问卷不存在');
    }

    request.surveyMeta = surveyMeta;

    // 兼容老的问卷没有ownerId
    if (
      surveyMeta.ownerId === user._id.toString() ||
      surveyMeta.owner === user.username
    ) {
      // 问卷的owner，可以访问和操作问卷
      return true;
    }

    if (surveyMeta.workspaceId) {
      const memberInfo = await this.workspaceMemberService.findOne({
        workspaceId: surveyMeta.workspaceId,
        userId: user._id.toString(),
      });
      if (!memberInfo) {
        throw new NoPermissionException('没有权限');
      }
      return true;
    }

    const permissions = this.reflector.get<string[]>(
      'surveyPermission',
      context.getHandler(),
    );

    if (!Array.isArray(permissions) || permissions.length === 0) {
      throw new NoPermissionException('没有权限');
    }

    const info = await this.collaboratorService.getCollaborator({
      surveyId,
      userId: user._id.toString(),
    });

    if (!info) {
      throw new NoPermissionException('没有权限');
    }
    request.collaborator = info;
    if (
      permissions.some((permission) => info.permissions.includes(permission))
    ) {
      return true;
    }
    throw new NoPermissionException('没有权限');
  }
}
