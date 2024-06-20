import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { get } from 'lodash';

import { NoPermissionException } from '../exceptions/noPermissionException';

import { WorkspaceMemberService } from 'src/modules/workspace/services/workspaceMember.service';
import { ROLE_PERMISSION as WORKSPACE_ROLE_PERMISSION } from 'src/enums/workspace';

@Injectable()
export class WorkspaceGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly workspaceMemberService: WorkspaceMemberService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowPermissions = this.reflector.get<string[]>(
      'workspacePermissions',
      context.getHandler(),
    );

    if (!allowPermissions) {
      return true; // 没有定义权限，可以访问
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const workspaceIdInfo = this.reflector.get(
      'workspaceId',
      context.getHandler(),
    );

    let workspaceIdKey, optional;
    if (typeof workspaceIdInfo === 'string') {
      workspaceIdKey = workspaceIdInfo;
      optional = false;
    } else {
      workspaceIdKey = workspaceIdInfo?.key;
      optional = workspaceIdInfo?.optional || false;
    }

    const workspaceId = get(request, workspaceIdKey);

    if (!workspaceId && optional === false) {
      throw new NoPermissionException('没有空间权限');
    }

    if (workspaceId) {
      const membersInfo = await this.workspaceMemberService.findOne({
        workspaceId,
        userId: user._id.toString(),
      });

      if (!membersInfo) {
        throw new NoPermissionException('没有空间权限');
      }

      const userPermissions = WORKSPACE_ROLE_PERMISSION[membersInfo.role] || [];
      if (
        allowPermissions.some((permission) =>
          userPermissions.includes(permission),
        )
      ) {
        return true;
      }
      throw new NoPermissionException('没有权限');
    }

    return true;
  }
}
