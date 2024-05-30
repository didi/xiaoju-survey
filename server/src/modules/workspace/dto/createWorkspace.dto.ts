import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';
import { ROLE as WORKSPACE_ROLE } from 'src/enums/workspace';

export class CreateWorkspaceDto {
  @ApiProperty({ description: '空间名称', required: true })
  name: string;

  @ApiProperty({ description: '空间描述', required: false })
  description?: string;

  @ApiProperty({ description: '空间成员', required: true })
  members: Array<{ userId: string; role: WORKSPACE_ROLE; _id?: string }>;

  static validate(data) {
    return Joi.object({
      name: Joi.string().required(),
      description: Joi.string().allow(null, ''),
      members: Joi.array()
        .allow(null)
        .items(
          Joi.object({
            userId: Joi.string().required(),
            role: Joi.string().valid(WORKSPACE_ROLE.ADMIN, WORKSPACE_ROLE.USER),
          }),
        ),
    }).validate(data, { allowUnknown: true });
  }
}
