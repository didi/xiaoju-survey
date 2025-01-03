import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class UpdateSurveyGroupDto {
  @ApiProperty({ description: '分组id', required: true })
  groupId: string;

  @ApiProperty({ description: '分组名称', required: true })
  name: string;

  static validate(data) {
    return Joi.object({
      groupId: Joi.string().required(),
      name: Joi.string().required(),
    }).validate(data);
  }
}
