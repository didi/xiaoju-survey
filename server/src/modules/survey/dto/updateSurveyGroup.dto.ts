import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class UpdateSurveyGroupDto {
  @ApiProperty({ description: '分组名称', required: true })
  name: string;

  static validate(data) {
    return Joi.object({
      name: Joi.string().required(),
    }).validate(data);
  }
}
