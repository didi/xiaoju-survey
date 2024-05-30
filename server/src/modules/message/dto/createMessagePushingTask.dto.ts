import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';
import {
  MESSAGE_PUSHING_TYPE,
  MESSAGE_PUSHING_HOOK,
} from 'src/enums/messagePushing';

export class CreateMessagePushingTaskDto {
  @ApiProperty({ description: '任务名称', required: true })
  name: string;

  @ApiProperty({ description: '任务类型', required: false, default: 'http' })
  type?: MESSAGE_PUSHING_TYPE;

  @ApiProperty({ description: '推送的http链接', required: true })
  pushAddress: string;

  @ApiProperty({
    description: '触发时机',
    required: false,
    default: 'response_inserted',
  })
  triggerHook?: MESSAGE_PUSHING_HOOK;

  @ApiProperty({
    description: '绑定的问卷id，初始可以为空后续再绑定',
    required: false,
    default: [],
  })
  surveys?: string[];

  static validate(data) {
    return Joi.object({
      name: Joi.string().required(),
      type: Joi.string().allow(null).default(MESSAGE_PUSHING_TYPE.HTTP),
      pushAddress: Joi.string().required(),
      triggerHook: Joi.string()
        .allow(null)
        .default(MESSAGE_PUSHING_HOOK.RESPONSE_INSERTED),
      surveys: Joi.array().items(Joi.string()).allow(null).default([]),
    }).validate(data);
  }
}
