import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  SetMetadata,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { Authentication } from 'src/guards/authentication.guard';
import { WorkspaceGuard } from 'src/guards/workspace.guard';

import { WorkspaceMemberService } from '../services/workspaceMember.service';

import { CreateWorkspaceMemberDto } from '../dto/createWorkspaceMember.dto';
import { UpdateWorkspaceMemberDto } from '../dto/updateWorkspaceMember.dto';
import { DeleteWorkspaceMemberDto } from '../dto/deleteWorkspaceMember.dto';

import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { PERMISSION as WORKSPACE_PERMISSION } from 'src/enums/workspace';

@ApiTags('workspaceMember')
@ApiBearerAuth()
@UseGuards(WorkspaceGuard)
@UseGuards(Authentication)
@Controller('/api/workspaceMember')
export class WorkspaceMemberController {
  constructor(
    private readonly workspaceMemberService: WorkspaceMemberService,
  ) {}

  @Post()
  @SetMetadata('workspacePermissions', [WORKSPACE_PERMISSION.WRITE_MEMBER])
  @SetMetadata('workspaceId', 'body.workspaceId')
  async create(@Body() member: CreateWorkspaceMemberDto) {
    const { error, value } = CreateWorkspaceMemberDto.validate(member);
    if (error) {
      throw new HttpException(
        `参数错误: ${error.message}`,
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    }
    const { workspaceId, role, userId } = value;
    const res = await this.workspaceMemberService.create({
      userId,
      workspaceId,
      role,
    });
    return {
      code: 200,
      data: {
        memberId: res._id.toString(),
      },
    };
  }

  @Get()
  @SetMetadata('workspacePermissions', [WORKSPACE_PERMISSION.READ_MEMBER])
  @SetMetadata('workspaceId', 'query.workspaceId')
  async findAll(@Request() req) {
    const workspaceId = req.query.workspaceId;
    if (!workspaceId) {
      throw new HttpException('参数错误', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    const list = await this.workspaceMemberService.findAllByWorkspaceId({
      workspaceId,
    });
    return {
      code: 200,
      data: list,
    };
  }

  @Post('updateRole')
  @SetMetadata('workspacePermissions', [WORKSPACE_PERMISSION.WRITE_MEMBER])
  @SetMetadata('workspaceId', 'body.workspaceId')
  async updateRole(
    @Body() updateDto: UpdateWorkspaceMemberDto,
    @Request() req,
  ) {
    const { error, value } = UpdateWorkspaceMemberDto.validate(updateDto);
    if (error) {
      throw new HttpException(
        `参数错误: ${error.message}`,
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    }
    const operator = req.user.username,
      operatorId = req.user._id.toString();
    const updateRes = await this.workspaceMemberService.updateRole({
      role: value.role,
      workspaceId: value.workspaceId,
      userId: value.userId,
      operator,
      operatorId,
    });
    return {
      code: 200,
      data: {
        modifiedCount: updateRes.modifiedCount,
      },
    };
  }

  @Post('deleteMember')
  @SetMetadata('workspacePermissions', [WORKSPACE_PERMISSION.WRITE_MEMBER])
  @SetMetadata('workspaceId', 'body.id')
  async delete(@Body() deleteDto: DeleteWorkspaceMemberDto) {
    const { value, error } = DeleteWorkspaceMemberDto.validate(deleteDto);
    if (error) {
      throw new HttpException(
        `参数错误: ${error.message}`,
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    }
    const res = await this.workspaceMemberService.deleteMember({ ...value });
    return {
      code: 200,
      data: {
        deletedCount: res.deletedCount,
      },
    };
  }
}
