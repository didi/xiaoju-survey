import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class DeleteWorkspaceMemberDto {
  @ApiProperty({ description: '空间id', required: false })
  workspaceId: string;

  @ApiProperty({ description: '用户id', required: false })
  userId: string;

  static validate(data) {
    return Joi.object({
      workspaceId: Joi.string().required(),
      userId: Joi.string().required(),
    }).validate(data);
  }
}
