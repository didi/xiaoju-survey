import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';
import { ROLE as WORKSPACE_ROLE } from 'src/enums/workspace';

export class UpdateWorkspaceMemberDto {
  @ApiProperty({ description: '空间角色', required: true })
  role: string;

  @ApiProperty({ description: '空间id', required: false })
  workspaceId: string;

  @ApiProperty({ description: '用户id', required: false })
  userId: string;

  static validate(data) {
    return Joi.object({
      role: Joi.string()
        .valid(WORKSPACE_ROLE.ADMIN, WORKSPACE_ROLE.USER)
        .required(),
      workspaceId: Joi.string().required(),
      userId: Joi.string().required(),
    }).validate(data);
  }
}
