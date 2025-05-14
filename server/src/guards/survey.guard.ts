import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { get } from 'lodash';

import { WorkspaceMemberService } from 'src/modules/workspace/services/workspaceMember.service';
import { CollaboratorService } from 'src/modules/survey/services/collaborator.service';
import { SurveyMetaService } from 'src/modules/survey/services/surveyMeta.service';
import { SurveyNotFoundException } from 'src/exceptions/surveyNotFoundException';
import { NoPermissionException } from 'src/exceptions/noPermissionException';

@Injectable()
export class SurveyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly collaboratorService: CollaboratorService,
    private readonly surveyMetaService: SurveyMetaService,
    private readonly workspaceMemberService: WorkspaceMemberService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const surveyIdKey = this.reflector.get<string>(
      'surveyId',
      context.getHandler(),
    );

    const surveyId = get(request, surveyIdKey);

    if (!surveyId) {
      return true;
    }

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
