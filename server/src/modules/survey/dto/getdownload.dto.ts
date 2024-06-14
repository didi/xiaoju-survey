import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class GetDownloadDto {
  @ApiProperty({ description: '问卷id', required: true })
  surveyId: string;
  @ApiProperty({ description: '是否脱密', required: true })
  isDesensitive: boolean;

  static validate(data) {
    return Joi.object({
      surveyId: Joi.string().required(),
        isDesensitive: Joi.boolean().default(true), // 默认true就是需要脱敏
    }).validate(data);
  }
}
export class GetDownloadListDto {
  @ApiProperty({ description: '拥有者id', required: true })
  ownerId: string;
  @ApiProperty({ description: '当前页', required: false })
  page: number;
  @ApiProperty({ description: '一页大小', required: false })
  pageSize: number;

  static validate(data) {
    return Joi.object({
      ownerId: Joi.string().required(),
      page: Joi.number().default(1),
      pageSize: Joi.number().default(20),
    }).validate(data);
  }
}
export class DownloadFileByNameDto {
  @ApiProperty({ description: '文件名', required: true })
  fileName: string;
  owner: string;
  static validate(data) {
    return Joi.object({
      fileName: Joi.string().required(),
      owner: Joi.string().required(),
    }).validate(data);
  }
}
