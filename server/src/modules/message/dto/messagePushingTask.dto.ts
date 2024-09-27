import { ApiProperty } from '@nestjs/swagger';

import {
  MESSAGE_PUSHING_TYPE,
  MESSAGE_PUSHING_HOOK,
} from 'src/enums/messagePushing';

export class MessagePushingTaskDto {
  @ApiProperty({ description: '任务id' })
  _id: string;

  @ApiProperty({ description: '任务名称' })
  name: string;

  @ApiProperty({ description: '任务类型' })
  type: MESSAGE_PUSHING_TYPE;

  @ApiProperty({ description: '推送的http链接' })
  pushAddress: string;

  @ApiProperty({ description: '触发时机' })
  triggerHook: MESSAGE_PUSHING_HOOK;

  @ApiProperty({ description: '包含问卷id' })
  surveys: string[];

  @ApiProperty({ description: '所有者' })
  owner: string;
}

export class CodeDto {
  @ApiProperty({ description: '状态码', default: 200 })
  code: number;
}

export class TaskIdDto {
  @ApiProperty({ description: '任务id' })
  taskId: string;
}

export class MessagePushingTaskSucceedResponseDto {
  @ApiProperty({ description: '状态码', default: 200 })
  code: number;

  @ApiProperty({ description: '任务详情' })
  data: MessagePushingTaskDto;
}

export class MessagePushingTaskListSucceedResponse {
  @ApiProperty({ description: '状态码', default: 200 })
  code: number;

  @ApiProperty({ description: '任务详情' })
  data: [MessagePushingTaskDto];
}
