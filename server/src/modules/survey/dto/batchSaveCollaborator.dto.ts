import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';
import { SURVEY_PERMISSION } from 'src/enums/surveyPermission';

export class CollaboratorDto {
  @ApiProperty({ description: '用户id', required: false })
  userId: string;

  @ApiProperty({
    description: '权限',
    required: true,
    isArray: true,
    enum: [
      SURVEY_PERMISSION.SURVEY_CONF_MANAGE,
      SURVEY_PERMISSION.SURVEY_COOPERATION_MANAGE,
      SURVEY_PERMISSION.SURVEY_RESPONSE_MANAGE,
    ],
  })
  permissions: Array<number>;
}

export class BatchSaveCollaboratorDto {
  @ApiProperty({ description: '问卷id', required: true })
  surveyId: string;

  @ApiProperty({ description: '协作人列表', required: true, isArray: true })
  collaborators: Array<CollaboratorDto>;

  static validate(data) {
    return Joi.object({
      surveyId: Joi.string().required(),
      collaborators: Joi.array()
        .allow(null)
        .items(
          Joi.object({
            _id: Joi.string().allow(null, ''),
            userId: Joi.string().required(),
            permissions: Joi.array()
              .required()
              .items(
                Joi.string().valid(
                  SURVEY_PERMISSION.SURVEY_CONF_MANAGE,
                  SURVEY_PERMISSION.SURVEY_COOPERATION_MANAGE,
                  SURVEY_PERMISSION.SURVEY_RESPONSE_MANAGE,
                ),
              ),
          }),
        ),
    }).validate(data, { allowUnknown: true });
  }
}
