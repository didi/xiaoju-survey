import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class GetSurveyRecycleListDto {
  @ApiProperty({ description: '当前页码', required: true })
  curPage: number;

  @ApiProperty({ description: '分页', required: false })
  pageSize: number;

  @ApiProperty({ description: '过滤调教', required: false })
  filter?: string;

  static validate(data) {
    return Joi.object({
      curPage: Joi.number().required(),
      pageSize: Joi.number().allow(null).default(10),
      filter: Joi.string().allow(null),
    }).validate(data);
  }
}
