import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class GetSurveyListDto {
  @ApiProperty({ description: '当前页码', required: true })
  curPage: number;

  @ApiProperty({ description: '分页', required: false })
  pageSize: number;

  @ApiProperty({ description: '过滤调教', required: false })
  filter?: string;

  @ApiProperty({ description: '排序条件', required: false })
  order?: string;

  @ApiProperty({ description: '空间id', required: false })
  workspaceId?: string;

  @ApiProperty({ description: '分组id', required: false })
  groupId?: string;

  @ApiProperty({ description: '是否查询回收站', required: false })
  isRecycleBin?: boolean;

  static validate(data) {
    return Joi.object({
      curPage: Joi.number().required(),
      pageSize: Joi.number().allow(null).default(10),
      filter: Joi.string().allow(null),
      order: Joi.string().allow(null),
      workspaceId: Joi.string().allow(null, ''),
      groupId: Joi.string().allow(null, ''),
      isRecycleBin: Joi.boolean().allow(null, false),
    }).validate(data);
  }
}
