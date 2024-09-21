import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class CreateSurveyDto {
  @ApiProperty({ description: '问卷标题', required: true })
  title: string;

  @ApiProperty({ description: '问卷备注', required: false })
  remark: string;

  @ApiProperty({ description: '问卷类型，复制问卷必传', required: false })
  surveyType: string;

  @ApiProperty({ description: '创建方法', required: false })
  createMethod?: string;

  @ApiProperty({ description: '创建来源', required: false })
  createFrom?: string;

  @ApiProperty({ description: '问卷创建在哪个空间下', required: false })
  workspaceId?: string;

  static validate(data) {
    return Joi.object({
      title: Joi.string().required(),
      remark: Joi.string().allow(null, '').default(''),
      surveyType: Joi.string().when('createMethod', {
        is: 'copy',
        then: Joi.allow(null),
        otherwise: Joi.required(),
      }),
      createMethod: Joi.string().allow(null).valid('copy').default('basic'),
      createFrom: Joi.string().when('createMethod', {
        is: 'copy',
        then: Joi.required(),
        otherwise: Joi.allow(null),
      }),
      workspaceId: Joi.string().allow(null, ''),
    }).validate(data);
  }
}
