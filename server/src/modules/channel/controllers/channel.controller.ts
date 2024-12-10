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

import { CreateChannelDto } from '../dto/createChannel.dto';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';

// import { UserService } from 'src/modules/auth/services/user.service';
import { Logger } from 'src/logger';
import { ChannelService } from '../services/channel.service';
import { GetChannelListDto } from '../dto/getChannelList.dto';
import { SurveyResponseService } from 'src/modules/surveyResponse/services/surveyResponse.service';

@ApiTags('channel')
@ApiBearerAuth()
@UseGuards(Authentication)
@Controller('/api/channel')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    private readonly surveyResponseService: SurveyResponseService,
    private readonly logger: Logger,
  ) {}

  @Post()
  @HttpCode(200)
  async create(@Body() channel: CreateChannelDto, @Request() req) {
    const { value, error } = CreateChannelDto.validate(channel);
    if (error) {
      this.logger.error(`CreateChannelDto validate failed: ${error.message}`);
      throw new HttpException(
        `参数错误: 请联系管理员`,
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    }

    const userId = req.user._id.toString();
    const username = req.user.username;
    // 插入渠道表
    const retChannel = await this.channelService.create({
      name: value.name,
      type: value.type,
      ownerId: userId,
    });
    const channelId = retChannel._id.toString();
   
    return {
      code: 200,
      data: {
        channelId,
      },
    };
  }

  @Get()
  @HttpCode(200)
  async findAll(@Request() req, @Query() queryInfo: GetChannelListDto) {
    const { value, error } = GetChannelListDto.validate(queryInfo);
    if (error) {
      this.logger.error(
        `GetChannelListDto validate failed: ${error.message}`,
      );
      throw new HttpException(
        `参数错误: 请联系管理员`,
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    }
    const userId = req.user._id.toString();
    const username = req.user.username;
    const curPage = Number(value.curPage);
    const pageSize = Number(value.pageSize);
    // 查询当前用户的的渠道列表
    const channelList = await this.channelService.findAllByUserId(userId);
    const idList = channelList.map((item) => item._id);
    // 遍历查询渠道的回收量
    const channelCountList = await Promise.all(
      idList.map((item) => {
        return this.surveyResponseService.getSurveyResponseTotalByChannel({
          channelId: item,
        });
      }),
    );

    const channelCountMap = idList.reduce((pre, cur: any, index) => {
      const count = channelCountList[index];
      pre[cur] = count;
      return pre;
    }, {});

    // 查询当前用户的空间列表
    const { list, count: total } =
      await this.channelService.findAllByIdWithPagination({
        idList,
        page: curPage,
        limit: pageSize,
        name: queryInfo.name,
      });
    return {
      code: 200,
      data: {
        list: list.map((item) => {
          const channelId = item._id.toString();
          return {
            ...item,
            createdAt: moment((item as any).createdAt).format('YYYY-MM-DD HH:mm:ss'),
            currentUserId: userId,
            currentUse: username,
            count: channelCountMap[channelId] || 0,
          };
        }),
        total,
      },
    };
  }

  // @Get(':id')
  // @HttpCode(200)
  // @UseGuards(WorkspaceGuard)
  // @SetMetadata('workspacePermissions', [WORKSPACE_PERMISSION.READ_WORKSPACE])
  // @SetMetadata('workspaceId', 'params.id')
  // async getWorkspaceInfo(@Param('id') workspaceId: string, @Request() req) {
  //   const workspaceInfo = await this.workspaceService.findOneById(workspaceId);
  //   const members = await this.workspaceMemberService.findAllByWorkspaceId({
  //     workspaceId,
  //   });
  //   const memberInfoMap = members.reduce((pre, cur) => {
  //     cur[cur.userId] = cur;
  //     return pre;
  //   }, {});
  //   const userIdList = members.map((item) => item.userId);
  //   const userList = await this.userService.getUserListByIds({
  //     idList: userIdList,
  //   });
  //   const userInfoMap = userList.reduce((pre, cur) => {
  //     const id = cur._id.toString();
  //     pre[id] = cur;
  //     return pre;
  //   }, {});
  //   const currentUserId = req.user._id.toString();
  //   return {
  //     code: 200,
  //     data: {
  //       _id: workspaceInfo._id,
  //       name: workspaceInfo.name,
  //       description: workspaceInfo.description,
  //       currentUserId,
  //       currentUserRole: memberInfoMap?.[currentUserId]?.role,
  //       members: members.map((item) => {
  //         return {
  //           _id: item._id,
  //           userId: item.userId,
  //           role: item.role,
  //           username: userInfoMap[item.userId].username,
  //         };
  //       }),
  //     },
  //   };
  // }

  // @Post(':id')
  // @HttpCode(200)
  // @UseGuards(WorkspaceGuard)
  // @SetMetadata('workspacePermissions', [WORKSPACE_PERMISSION.WRITE_WORKSPACE])
  // @SetMetadata('workspaceId', 'params.id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() workspace: CreateWorkspaceDto,
  //   @Request() req,
  // ) {
  //   const members = workspace.members;
  //   if (!Array.isArray(members) || members.length === 0) {
  //     throw new HttpException('成员不能为空', EXCEPTION_CODE.PARAMETER_ERROR);
  //   }
  //   delete workspace.members;
  //   const operator = req.user.username,
  //     operatorId = req.user._id.toString();
  //   const updateRes = await this.workspaceService.update({
  //     id,
  //     workspace,
  //     operator,
  //     operatorId,
  //   });
  //   this.logger.info(`updateRes: ${JSON.stringify(updateRes)}`);
  //   const { newMembers, adminMembers, userMembers } = splitMembers(members);
  //   if (
  //     adminMembers.length === 0 &&
  //     !newMembers.some((item) => item.role === WORKSPACE_ROLE.ADMIN)
  //   ) {
  //     throw new HttpException(
  //       '空间不能没有管理员',
  //       EXCEPTION_CODE.PARAMETER_ERROR,
  //     );
  //   }
  //   const allUserIdList = members.map((item) => item.userId);
  //   // 不能有重复的userId
  //   const allUserIdSet = new Set(allUserIdList);
  //   if (allUserIdList.length !== Array.from(allUserIdSet).length) {
  //     throw new HttpException(
  //       '不能重复添加用户',
  //       EXCEPTION_CODE.PARAMETER_ERROR,
  //     );
  //   }
  //   // 检查所有成员是否真实存在
  //   const allUserList = await this.userService.getUserListByIds({
  //     idList: allUserIdList,
  //   });
  //   const allUserInfoMap = allUserList.reduce((pre, cur) => {
  //     const id = cur._id.toString();
  //     pre[id] = cur;
  //     return pre;
  //   }, {});
  //   for (const member of members) {
  //     if (!allUserInfoMap[member.userId]) {
  //       throw new HttpException(
  //         `用户id: {${member.userId}} 不存在`,
  //         EXCEPTION_CODE.PARAMETER_ERROR,
  //       );
  //     }
  //   }

  //   const allIds = [...adminMembers, ...userMembers];
  //   // 新增和更新成员,把数据库里已删除的成员删掉
  //   const res = await Promise.all([
  //     this.workspaceMemberService.batchDelete({ idList: [], neIdList: allIds }),
  //     this.workspaceMemberService.batchCreate({
  //       workspaceId: id,
  //       members: newMembers,
  //       creator: operator,
  //       creatorId: operatorId,
  //     }),
  //     this.workspaceMemberService.batchUpdate({
  //       idList: adminMembers,
  //       role: WORKSPACE_ROLE.ADMIN,
  //       operator,
  //       operatorId,
  //     }),
  //     this.workspaceMemberService.batchUpdate({
  //       idList: userMembers,
  //       role: WORKSPACE_ROLE.USER,
  //       operator,
  //       operatorId,
  //     }),
  //   ]);
  //   this.logger.info(`updateRes: ${JSON.stringify(res)}`);
  //   return {
  //     code: 200,
  //   };
  // }

  // @Delete(':id')
  // @HttpCode(200)
  // @UseGuards(WorkspaceGuard)
  // @SetMetadata('workspacePermissions', [WORKSPACE_PERMISSION.WRITE_WORKSPACE])
  // @SetMetadata('workspaceId', 'params.id')
  // async delete(@Param('id') id: string, @Request() req) {
  //   const operator = req.user.username,
  //     operatorId = req.user._id.toString();
  //   const res = await this.workspaceService.delete(id, {
  //     operator,
  //     operatorId,
  //   });
  //   this.logger.info(`res: ${JSON.stringify(res)}`);
  //   return {
  //     code: 200,
  //   };
  // }

  // @Get('/member/list')
  // @HttpCode(200)
  // async getWorkspaceAndMember(@Request() req) {
  //   const userId = req.user._id.toString();

  //   // 所在所有空间
  //   const workspaceList = await this.workspaceService.findAllByUserId(userId);
  //   if (!workspaceList.length) {
  //     return {
  //       code: 200,
  //       data: [],
  //     };
  //   }

  //   // 所有空间下的所有成员
  //   const workspaceMemberList =
  //     await this.workspaceMemberService.batchSearchByWorkspace(
  //       workspaceList.map((item) => item._id.toString()),
  //     );

  //   // 查询成员姓名
  //   const userList = await this.userService.getUserListByIds({
  //     idList: workspaceMemberList.map((member) => member.userId),
  //   });
  //   const userInfoMap = userList.reduce((pre, cur) => {
  //     const id = cur._id.toString();
  //     pre[id] = cur;
  //     return pre;
  //   }, {});

  //   const temp: Record<string, WorkspaceMember[]> = {};
  //   const list = workspaceList.map(
  //     (item: Workspace & { members: WorkspaceMember[] }) => {
  //       temp[item._id.toString()] = item.members = [];
  //       return item;
  //     },
  //   );

  //   workspaceMemberList.forEach((member: WorkspaceMember) => {
  //     (member as any).username = userInfoMap[member.userId.toString()].username;
  //     temp[member.workspaceId.toString()].push(member);
  //   });

  //   return {
  //     code: 200,
  //     data: list,
  //   };
  // }
}
