import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';
import { SURVEY_PERMISSION } from 'src/enums/surveyPermission';

export class ChangeUserPermissionDto {
  @ApiProperty({ description: '问卷id', required: true })
  surveyId: string;

  @ApiProperty({ description: '用户id', required: false })
  userId: string;

  @ApiProperty({ description: '权限', required: true })
  permissions: Array<string>;

  static validate(data) {
    return Joi.object({
      surveyId: Joi.string(),
      userId: Joi.string(),
      permissions: Joi.array().items(
        Joi.string().valid(
          SURVEY_PERMISSION.SURVEY_CONF_MANAGE,
          SURVEY_PERMISSION.SURVEY_COOPERATION_MANAGE,
          SURVEY_PERMISSION.SURVEY_RESPONSE_MANAGE,
        ),
      ),
    }).validate(data);
  }
}
