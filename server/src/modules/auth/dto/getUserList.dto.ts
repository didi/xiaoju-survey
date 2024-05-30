import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class GetUserListDto {
  @ApiProperty({ description: '用户名', required: true })
  username: string;

  @ApiProperty({ description: '页码', required: false, default: 1 })
  pageIndex?: number;

  @ApiProperty({ description: '每页查询数', required: false, default: 10 })
  pageSize: number;

  static validate(data) {
    return Joi.object({
      username: Joi.string().required(),
      pageIndex: Joi.number().allow(null).default(1),
      pageSize: Joi.number().allow(null).default(10),
    }).validate(data);
  }
}
