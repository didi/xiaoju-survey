import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Request,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import * as Joi from 'joi';

import { Authentication } from 'src/guards/authentication.guard';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { SurveyGuard } from 'src/guards/survey.guard';
import {
  SURVEY_PERMISSION,
  SURVEY_PERMISSION_DESCRIPTION,
} from 'src/enums/surveyPermission';
import { Logger } from 'src/logger';
import { WorkspaceMemberService } from 'src/modules/workspace/services/workspaceMember.service';

import { CollaboratorService } from '../services/collaborator.service';
import { UserService } from 'src/modules/auth/services/user.service';

import { CreateCollaboratorDto } from '../dto/createCollaborator.dto';
import { ChangeUserPermissionDto } from '../dto/changeUserPermission.dto';
import { GetSurveyCollaboratorListDto } from '../dto/getSurveyCollaboratorList.dto';
import { BatchSaveCollaboratorDto } from '../dto/batchSaveCollaborator.dto';
import { splitCollaborators } from '../utils/splitCollaborator';
import { SurveyMetaService } from '../services/surveyMeta.service';

@UseGuards(Authentication)
@ApiTags('collaborator')
@ApiBearerAuth()
@Controller('/api/collaborator')
export class CollaboratorController {
  constructor(
    private readonly collaboratorService: CollaboratorService,
    private readonly logger: Logger,
    private readonly userService: UserService,
    private readonly surveyMetaService: SurveyMetaService,
    private readonly workspaceMemberServie: WorkspaceMemberService,
  ) {}

  @Get('getPermissionList')
  @HttpCode(200)
  async getPermissionList() {
    const vals = Object.values(SURVEY_PERMISSION_DESCRIPTION);
    return {
      code: 200,
      data: vals,
    };
  }

  @Post('')
  @HttpCode(200)
  @UseGuards(SurveyGuard)
  @SetMetadata('surveyId', 'body.surveyId')
  @SetMetadata('surveyPermission', [
    SURVEY_PERMISSION.SURVEY_COOPERATION_MANAGE,
  ])
  async addCollaborator(
    @Body() reqBody: CreateCollaboratorDto,
    @Request() req,
  ) {
    const { error, value } = CreateCollaboratorDto.validate(reqBody);
    if (error) {
      this.logger.error(error.message);
      throw new HttpException(
        '系统错误，请联系管理员',
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    }

    // 检查用户是否存在
    const user = await this.userService.getUserById(value.userId);
    if (!user) {
      throw new HttpException('用户不存在', EXCEPTION_CODE.USER_NOT_EXISTS);
    }

    if (user._id.toString() === req.surveyMeta.ownerId) {
      throw new HttpException(
        '不能给问卷所有者授权',
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    }

    const collaborator = await this.collaboratorService.getCollaborator({
      userId: value.userId,
      surveyId: value.surveyId,
    });

    if (collaborator) {
      throw new HttpException(
        '用户已经是协作者',
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    }

    const res = await this.collaboratorService.create(value);

    return {
      code: 200,
      data: {
        collaboratorId: res._id.toString(),
      },
    };
  }

  @Post('batchSave')
  @HttpCode(200)
  @UseGuards(SurveyGuard)
  @SetMetadata('surveyId', 'body.surveyId')
  @SetMetadata('surveyPermission', [
    SURVEY_PERMISSION.SURVEY_COOPERATION_MANAGE,
  ])
  async batchSaveCollaborator(
    @Body() reqBody: BatchSaveCollaboratorDto,
    @Request() req,
  ) {
    const { error, value } = BatchSaveCollaboratorDto.validate(reqBody);
    if (error) {
      this.logger.error(error.message);
      throw new HttpException(
        '系统错误，请联系管理员',
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    }

    if (Array.isArray(value.collaborators) && value.collaborators.length > 0) {
      const collaboratorUserIdList = value.collaborators.map(
        (item) => item.userId,
      );
      for (const collaboratorUserId of collaboratorUserIdList) {
        if (collaboratorUserId === req.surveyMeta.ownerId) {
          throw new HttpException(
            '不能给问卷所有者授权',
            EXCEPTION_CODE.PARAMETER_ERROR,
          );
        }
      }
      // 不能有重复的userId
      const userIdSet = new Set(collaboratorUserIdList);
      if (collaboratorUserIdList.length !== Array.from(userIdSet).length) {
        throw new HttpException(
          '不能重复添加用户',
          EXCEPTION_CODE.PARAMETER_ERROR,
        );
      }
      const userList = await this.userService.getUserListByIds({
        idList: collaboratorUserIdList,
      });
      const userInfoMap = userList.reduce((pre, cur) => {
        const id = cur._id.toString();
        pre[id] = cur;
        return pre;
      }, {});

      for (const collaborator of value.collaborators) {
        if (!userInfoMap[collaborator.userId]) {
          throw new HttpException(
            `用户id: {${collaborator.userId}} 不存在`,
            EXCEPTION_CODE.PARAMETER_ERROR,
          );
        }
      }
    }

    if (Array.isArray(value.collaborators) && value.collaborators.length > 0) {
      const { newCollaborator, existsCollaborator } = splitCollaborators(
        value.collaborators,
      );
      const collaboratorIdList = existsCollaborator.map((item) => item._id);
      const newCollaboratorUserIdList = newCollaborator.map(
        (item) => item.userId,
      );
      const delRes = await this.collaboratorService.batchDelete({
        surveyId: value.surveyId,
        idList: [],
        neIdList: collaboratorIdList,
        userIdList: newCollaboratorUserIdList,
      });
      this.logger.info('batchDelete:' + JSON.stringify(delRes));
      const username = req.user.username;
      const userId = req.user._id.toString();
      if (Array.isArray(newCollaborator) && newCollaborator.length > 0) {
        const insertRes = await this.collaboratorService.batchCreate({
          surveyId: value.surveyId,
          collaboratorList: newCollaborator,
          creator: username,
          creatorId: userId,
        });
        this.logger.info(`${JSON.stringify(insertRes)}`);
      }
      if (Array.isArray(existsCollaborator) && existsCollaborator.length > 0) {
        const updateRes = await Promise.all(
          existsCollaborator.map((item) =>
            this.collaboratorService.updateById({
              collaboratorId: item._id,
              permissions: item.permissions,
              operator: username,
              operatorId: userId,
            }),
          ),
        );
        this.logger.info(`${JSON.stringify(updateRes)}`);
      }
    } else {
      // 删除所有协作者
      const delRes = await this.collaboratorService.batchDeleteBySurveyId(
        value.surveyId,
      );
      this.logger.info(JSON.stringify(delRes));
    }

    return {
      code: 200,
    };
  }

  @Get('')
  @HttpCode(200)
  @UseGuards(SurveyGuard)
  @SetMetadata('surveyId', 'query.surveyId')
  @SetMetadata('surveyPermission', [
    SURVEY_PERMISSION.SURVEY_COOPERATION_MANAGE,
  ])
  async getSurveyCollaboratorList(
    @Query() query: GetSurveyCollaboratorListDto,
  ) {
    const { error, value } = GetSurveyCollaboratorListDto.validate(query);
    if (error) {
      this.logger.error(error.message);
      throw new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR);
    }

    const res = await this.collaboratorService.getSurveyCollaboratorList(value);

    const userIdList = res.map((item) => item.userId);
    const userList = await this.userService.getUserListByIds({
      idList: userIdList,
    });
    const userInfoMap = userList.reduce((pre, cur) => {
      const id = cur._id.toString();
      pre[id] = cur;
      return pre;
    }, {});

    return {
      code: 200,
      data: res.map((item) => {
        return {
          ...item,
          username: userInfoMap[item.userId]?.username || '',
        };
      }),
    };
  }

  @Post('changeUserPermission')
  @HttpCode(200)
  @UseGuards(SurveyGuard)
  @SetMetadata('surveyId', 'body.surveyId')
  @SetMetadata('surveyPermission', [
    SURVEY_PERMISSION.SURVEY_COOPERATION_MANAGE,
  ])
  async changeUserPermission(@Body() reqBody: ChangeUserPermissionDto) {
    const { error, value } = Joi.object({
      surveyId: Joi.string(),
      userId: Joi.string(),
      permissions: Joi.array().items(Joi.string().required()),
    }).validate(reqBody);
    if (error) {
      this.logger.error(error.message);
      throw new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR);
    }

    const res = await this.collaboratorService.changeUserPermission(value);

    return {
      code: 200,
      data: res,
    };
  }

  @Post('deleteCollaborator')
  @HttpCode(200)
  @UseGuards(SurveyGuard)
  @SetMetadata('surveyId', 'body.surveyId')
  @SetMetadata('surveyPermission', [
    SURVEY_PERMISSION.SURVEY_COOPERATION_MANAGE,
  ])
  async deleteCollaborator(@Query() query) {
    const { error, value } = Joi.object({
      surveyId: Joi.string(),
      userId: Joi.string(),
    }).validate(query);
    if (error) {
      this.logger.error(error.message);
      throw new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR);
    }

    const res = await this.collaboratorService.deleteCollaborator(value);

    return {
      code: 200,
      data: res,
    };
  }

  @HttpCode(200)
  @Get('permissions')
  async getUserSurveyPermissions(@Request() req, @Query() query) {
    const user = req.user;
    const userId = user._id.toString();
    const surveyId = query.surveyId;
    const surveyMeta = await this.surveyMetaService.getSurveyById({ surveyId });

    if (!surveyMeta) {
      this.logger.error(`问卷不存在: ${surveyId}`);
      throw new HttpException('问卷不存在', EXCEPTION_CODE.SURVEY_NOT_FOUND);
    }

    // 问卷owner，有问卷的权限
    if (
      surveyMeta?.ownerId === userId ||
      surveyMeta?.owner === req.user.username
    ) {
      return {
        code: 200,
        data: {
          isOwner: true,
          permissions: [
            SURVEY_PERMISSION.SURVEY_COOPERATION_MANAGE,
            SURVEY_PERMISSION.SURVEY_RESPONSE_MANAGE,
            SURVEY_PERMISSION.SURVEY_CONF_MANAGE,
          ],
        },
      };
    }
    // 有空间权限，默认也有所有权限
    if (surveyMeta.workspaceId) {
      const memberInfo = await this.workspaceMemberServie.findOne({
        workspaceId: surveyMeta.workspaceId,
        userId,
      });
      if (memberInfo) {
        return {
          code: 200,
          data: {
            isOwner: false,
            permissions: [
              SURVEY_PERMISSION.SURVEY_COOPERATION_MANAGE,
              SURVEY_PERMISSION.SURVEY_RESPONSE_MANAGE,
              SURVEY_PERMISSION.SURVEY_CONF_MANAGE,
            ],
          },
        };
      }
    }

    const colloborator = await this.collaboratorService.getCollaborator({
      surveyId,
      userId,
    });
    return {
      code: 200,
      data: {
        isOwner: false,
        permissions: colloborator?.permissions || [],
      },
    };
  }
}
