import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class RecycleBinListDto {
  @ApiProperty({ description: '当前页码', required: true })
  curPage: number;

  @ApiProperty({ description: '分页大小', required: false })
  pageSize: number;

  static validate(data) {
    return Joi.object({
      curPage: Joi.number().required(),
      pageSize: Joi.number().allow(null).default(10),
    }).validate(data);
  }
}

export class RecycleBinItemDto {
  @ApiProperty({ description: '问卷ID', required: true })
  id: string;

  static validate(data) {
    return Joi.object({
      id: Joi.string().required(),
    }).validate(data);
  }
} 