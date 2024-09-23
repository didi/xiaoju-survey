import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class CreateDownloadDto {
  @ApiProperty({ description: '问卷id', required: true })
  surveyId: string;
  @ApiProperty({ description: '是否脱敏', required: false })
  isMasked: boolean;

  static validate(data) {
    return Joi.object({
      surveyId: Joi.string().required(),
      isMasked: Joi.boolean().allow(null).default(false),
    }).validate(data);
  }
}
export class GetDownloadTaskListDto {
  @ApiProperty({ description: '当前页', required: false })
  pageIndex: number;
  @ApiProperty({ description: '一页大小', required: false })
  pageSize: number;

  static validate(data) {
    return Joi.object({
      pageIndex: Joi.number().default(1),
      pageSize: Joi.number().default(20),
    }).validate(data);
  }
}

export class GetDownloadTaskDto {
  @ApiProperty({ description: '任务id', required: true })
  taskId: string;

  static validate(data) {
    return Joi.object({
      taskId: Joi.string().required(),
    }).validate(data);
  }
}

export class DeleteDownloadTaskDto {
  @ApiProperty({ description: '任务id', required: true })
  taskId: string;

  static validate(data) {
    return Joi.object({
      taskId: Joi.string().required(),
    }).validate(data);
  }
}
