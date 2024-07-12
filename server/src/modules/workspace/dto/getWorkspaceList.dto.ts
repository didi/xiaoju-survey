import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class GetWorkspaceListDto {
  @ApiProperty({ description: '当前页码', required: true })
  curPage: number;

  @ApiProperty({ description: '分页', required: false })
  pageSize: number;

  @ApiProperty({ description: '空间名称', required: false })
  name?: string;

  static validate(data: Partial<GetWorkspaceListDto>): Joi.ValidationResult {
    return Joi.object({
      curPage: Joi.number().required(),
      pageSize: Joi.number().allow(null).default(10),
      name: Joi.string().allow(null, '').optional(),
    }).validate(data);
  }
}
