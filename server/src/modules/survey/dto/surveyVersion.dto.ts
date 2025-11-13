import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class CreateVersionDto {
  @ApiProperty({ description: '问卷ID', required: true })
  surveyId: string;

  @ApiProperty({ description: '版本描述', required: false })
  description?: string;

  @ApiProperty({ description: '变更摘要', required: false })
  changesSummary?: string;

  @ApiProperty({ description: '版本标签', required: false })
  tags?: string[];

  static validate(data) {
    return Joi.object({
      surveyId: Joi.string().required(),
      description: Joi.string().allow(null, '').default(''),
      changesSummary: Joi.string().allow(null, '').default(''),
      tags: Joi.array().items(Joi.string()).allow(null).default([]),
    }).validate(data);
  }
}

export class RestoreVersionDto {
  @ApiProperty({ description: '版本ID', required: true })
  versionId: string;

  @ApiProperty({ description: '恢复原因', required: true })
  restoreReason: string;

  static validate(data) {
    return Joi.object({
      versionId: Joi.string().required(),
      restoreReason: Joi.string().required(),
    }).validate(data);
  }
}

export class TagVersionDto {
  @ApiProperty({ description: '标签名称', required: true })
  tag: string;

  static validate(data) {
    return Joi.object({
      tag: Joi.string().required(),
    }).validate(data);
  }
}

export class CompareVersionsDto {
  @ApiProperty({ description: '第一个版本ID', required: true })
  versionId1: string;

  @ApiProperty({ description: '第二个版本ID', required: true })
  versionId2: string;

  static validate(data) {
    return Joi.object({
      versionId1: Joi.string().required(),
      versionId2: Joi.string().required(),
    }).validate(data);
  }
}
