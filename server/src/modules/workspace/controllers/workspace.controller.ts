import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  SetMetadata,
  HttpCode,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import moment from 'moment';

import { Authentication } from 'src/guards/authentication.guard';
import { WorkspaceGuard } from 'src/guards/workspace.guard';

import { WorkspaceService } from '../services/workspace.service';
import { WorkspaceMemberService } from '../services/workspaceMember.service';

import { CreateWorkspaceDto } from '../dto/createWorkspace.dto';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import {
  ROLE as WORKSPACE_ROLE,
  PERMISSION as WORKSPACE_PERMISSION,
  ROLE_PERMISSION as WORKSPACE_ROLE_PERMISSION,
} from 'src/enums/workspace';
import { splitMembers } from '../utils/splitMember';
import { UserService } from 'src/modules/auth/services/user.service';
import { SurveyMetaService } from 'src/modules/survey/services/surveyMeta.service';
import { Logger } from 'src/logger';
import { GetWorkspaceListDto } from '../dto/getWorkspaceList.dto';
import { WorkspaceMember } from 'src/models/workspaceMember.entity';
import { Workspace } from 'src/models/workspace.entity';

@ApiTags('workspace')
@ApiBearerAuth()
@UseGuards(Authentication)
@Controller('/api/workspace')
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly workspaceMemberService: WorkspaceMemberService,
    private readonly userService: UserService,
    private readonly surveyMetaService: SurveyMetaService,
    private readonly logger: Logger,
  ) {}

  @Get('getRoleList')
  @HttpCode(200)
  async getRoleList() {
    const rolePermissions = Object.values(WORKSPACE_ROLE_PERMISSION);
    return {
      code: 200,
      data: rolePermissions,
    };
  }

  @Post()
  @HttpCode(200)
  async create(@Body() workspace: CreateWorkspaceDto, @Request() req) {
    const { value, error } = CreateWorkspaceDto.validate(workspace);
    if (error) {
      this.logger.error(`CreateWorkspaceDto validate failed: ${error.message}`);
      throw new HttpException(
        `参数错误: 请联系管理员`,
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    }

    if (Array.isArray(value.members) && value.members.length > 0) {
      // 校验用户是否真实存在
      const userIdList = value.members.map((item) => item.userId);
      // 不能有重复的userId
      const userIdSet = new Set(userIdList);
      if (userIdList.length !== Array.from(userIdSet).length) {
        throw new HttpException(
          '不能重复添加用户',
          EXCEPTION_CODE.PARAMETER_ERROR,
        );
      }
      const userList = await this.userService.getUserListByIds({
        idList: userIdList,
      });
      const userInfoMap = userList.reduce((pre, cur) => {
        const id = cur._id.toString();
        pre[id] = cur;
        return pre;
      }, {});
      for (const member of value.members) {
        if (!userInfoMap[member.userId]) {
          throw new HttpException(
            `用户id: {${member.userId}} 不存在`,
            EXCEPTION_CODE.PARAMETER_ERROR,
          );
        }
      }
    }
    const userId = req.user._id.toString();
    const username = req.user.username;
    // 插入空间表
    const retWorkspace = await this.workspaceService.create({
      name: value.name,
      description: value.description,
      owner: username,
      ownerId: userId,
    });
    const workspaceId = retWorkspace._id.toString();
    // 空间的成员表要新增一条管理员数据
    await this.workspaceMemberService.create({
      userId,
      workspaceId,
      role: WORKSPACE_ROLE.ADMIN,
    });
    if (Array.isArray(value.members) && value.members.length > 0) {
      await this.workspaceMemberService.batchCreate({
        workspaceId,
        members: value.members,
        creator: username,
        creatorId: userId,
      });
    }
    return {
      code: 200,
      data: {
        workspaceId,
      },
    };
  }

  @Get()
  @HttpCode(200)
  async findAll(@Request() req, @Query() queryInfo: GetWorkspaceListDto) {
    const { value, error } = GetWorkspaceListDto.validate(queryInfo);
    if (error) {
      this.logger.error(
        `GetWorkspaceListDto validate failed: ${error.message}`,
      );
      throw new HttpException(
        `参数错误: 请联系管理员`,
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    }
    const userId = req.user._id.toString();
    const curPage = Number(value.curPage);
    const pageSize = Number(value.pageSize);
    // 查询当前用户参与的空间
    const workspaceInfoList = await this.workspaceMemberService.findAllByUserId(
      { userId },
    );
    const workspaceIdList = workspaceInfoList.map((item) => item.workspaceId);
    const workspaceInfoMap = workspaceInfoList.reduce((pre, cur) => {
      pre[cur.workspaceId] = cur;
      return pre;
    }, {});

    // 查询当前用户的空间列表
    const { list, count } =
      await this.workspaceService.findAllByIdWithPagination({
        workspaceIdList,
        page: curPage,
        limit: pageSize,
        name: queryInfo.name,
      });
    const ownerIdList = list.map((item: { ownerId: any }) => item.ownerId);
    const userList = await this.userService.getUserListByIds({
      idList: ownerIdList,
    });
    const userInfoMap = userList.reduce((pre, cur) => {
      const id = cur._id.toString();
      pre[id] = cur;
      return pre;
    }, {});

    const surveyTotalList = await Promise.all(
      workspaceIdList.map((item) => {
        return this.surveyMetaService.countSurveyMetaByWorkspaceId({
          workspaceId: item,
        });
      }),
    );
    const surveyTotalMap = workspaceIdList.reduce((pre, cur, index) => {
      const total = surveyTotalList[index];
      pre[cur] = total;
      return pre;
    }, {});

    const memberTotalList = await Promise.all(
      workspaceIdList.map((item) => {
        return this.workspaceMemberService.countByWorkspaceId({
          workspaceId: item,
        });
      }),
    );
    const memberTotalMap = workspaceIdList.reduce((pre, cur, index) => {
      const total = memberTotalList[index];
      pre[cur] = total;
      return pre;
    }, {});

    return {
      code: 200,
      data: {
        list: list.map((item) => {
          const workspaceId = item._id.toString();
          const curWorkspaceInfo = workspaceInfoMap?.[workspaceId] || {};
          const ownerInfo = userInfoMap?.[item.ownerId] || {};
          return {
            ...item,
            createdAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
            owner: ownerInfo.username,
            currentUserId: curWorkspaceInfo.userId,
            currentUserRole: curWorkspaceInfo.role,
            surveyTotal: surveyTotalMap[workspaceId] || 0,
            memberTotal: memberTotalMap[workspaceId] || 0,
          };
        }),
        count,
      },
    };
  }

  @Get(':id')
  @HttpCode(200)
  @UseGuards(WorkspaceGuard)
  @SetMetadata('workspacePermissions', [WORKSPACE_PERMISSION.READ_WORKSPACE])
  @SetMetadata('workspaceId', 'params.id')
  async getWorkspaceInfo(@Param('id') workspaceId: string, @Request() req) {
    const workspaceInfo = await this.workspaceService.findOneById(workspaceId);
    const members = await this.workspaceMemberService.findAllByWorkspaceId({
      workspaceId,
    });
    const memberInfoMap = members.reduce((pre, cur) => {
      cur[cur.userId] = cur;
      return pre;
    }, {});
    const userIdList = members.map((item) => item.userId);
    const userList = await this.userService.getUserListByIds({
      idList: userIdList,
    });
    const userInfoMap = userList.reduce((pre, cur) => {
      const id = cur._id.toString();
      pre[id] = cur;
      return pre;
    }, {});
    const currentUserId = req.user._id.toString();
    return {
      code: 200,
      data: {
        _id: workspaceInfo._id,
        name: workspaceInfo.name,
        description: workspaceInfo.description,
        currentUserId,
        currentUserRole: memberInfoMap?.[currentUserId]?.role,
        members: members.map((item) => {
          return {
            _id: item._id,
            userId: item.userId,
            role: item.role,
            username: userInfoMap[item.userId].username,
          };
        }),
      },
    };
  }

  @Post(':id')
  @HttpCode(200)
  @UseGuards(WorkspaceGuard)
  @SetMetadata('workspacePermissions', [WORKSPACE_PERMISSION.WRITE_WORKSPACE])
  @SetMetadata('workspaceId', 'params.id')
  async update(
    @Param('id') id: string,
    @Body() workspace: CreateWorkspaceDto,
    @Request() req,
  ) {
    const members = workspace.members;
    if (!Array.isArray(members) || members.length === 0) {
      throw new HttpException('成员不能为空', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    delete workspace.members;
    const operator = req.user.username,
      operatorId = req.user._id.toString();
    const updateRes = await this.workspaceService.update({
      id,
      workspace,
      operator,
      operatorId,
    });
    this.logger.info(`updateRes: ${JSON.stringify(updateRes)}`);
    const { newMembers, adminMembers, userMembers } = splitMembers(members);
    if (
      adminMembers.length === 0 &&
      !newMembers.some((item) => item.role === WORKSPACE_ROLE.ADMIN)
    ) {
      throw new HttpException(
        '空间不能没有管理员',
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    }
    const allUserIdList = members.map((item) => item.userId);
    // 不能有重复的userId
    const allUserIdSet = new Set(allUserIdList);
    if (allUserIdList.length !== Array.from(allUserIdSet).length) {
      throw new HttpException(
        '不能重复添加用户',
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    }
    // 检查所有成员是否真实存在
    const allUserList = await this.userService.getUserListByIds({
      idList: allUserIdList,
    });
    const allUserInfoMap = allUserList.reduce((pre, cur) => {
      const id = cur._id.toString();
      pre[id] = cur;
      return pre;
    }, {});
    for (const member of members) {
      if (!allUserInfoMap[member.userId]) {
        throw new HttpException(
          `用户id: {${member.userId}} 不存在`,
          EXCEPTION_CODE.PARAMETER_ERROR,
        );
      }
    }

    const allIds = [...adminMembers, ...userMembers];
    // 新增和更新成员,把数据库里已删除的成员删掉
    const res = await Promise.all([
      this.workspaceMemberService.batchDelete({ idList: [], neIdList: allIds }),
      this.workspaceMemberService.batchCreate({
        workspaceId: id,
        members: newMembers,
        creator: operator,
        creatorId: operatorId,
      }),
      this.workspaceMemberService.batchUpdate({
        idList: adminMembers,
        role: WORKSPACE_ROLE.ADMIN,
        operator,
        operatorId,
      }),
      this.workspaceMemberService.batchUpdate({
        idList: userMembers,
        role: WORKSPACE_ROLE.USER,
        operator,
        operatorId,
      }),
    ]);
    this.logger.info(`updateRes: ${JSON.stringify(res)}`);
    return {
      code: 200,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  @UseGuards(WorkspaceGuard)
  @SetMetadata('workspacePermissions', [WORKSPACE_PERMISSION.WRITE_WORKSPACE])
  @SetMetadata('workspaceId', 'params.id')
  async delete(@Param('id') id: string, @Request() req) {
    const operator = req.user.username,
      operatorId = req.user._id.toString();
    const res = await this.workspaceService.delete(id, {
      operator,
      operatorId,
    });
    this.logger.info(`res: ${JSON.stringify(res)}`);
    return {
      code: 200,
    };
  }

  @Get('/member/list')
  @HttpCode(200)
  async getWorkspaceAndMember(@Request() req) {
    const userId = req.user._id.toString();

    // 所在所有空间
    const workspaceList = await this.workspaceService.findAllByUserId(userId);
    if (!workspaceList.length) {
      return {
        code: 200,
        data: [],
      };
    }

    // 所有空间下的所有成员
    const workspaceMemberList =
      await this.workspaceMemberService.batchSearchByWorkspace(
        workspaceList.map((item) => item._id.toString()),
      );

    // 查询成员姓名
    const userList = await this.userService.getUserListByIds({
      idList: workspaceMemberList.map((member) => member.userId),
    });
    const userInfoMap = userList.reduce((pre, cur) => {
      const id = cur._id.toString();
      pre[id] = cur;
      return pre;
    }, {});

    const temp: Record<string, WorkspaceMember[]> = {};
    const list = workspaceList.map(
      (item: Workspace & { members: WorkspaceMember[] }) => {
        temp[item._id.toString()] = item.members = [];
        return item;
      },
    );

    workspaceMemberList.forEach((member: WorkspaceMember) => {
      (member as any).username = userInfoMap[member.userId.toString()].username;
      temp[member.workspaceId.toString()].push(member);
    });

    return {
      code: 200,
      data: list,
    };
  }
}
