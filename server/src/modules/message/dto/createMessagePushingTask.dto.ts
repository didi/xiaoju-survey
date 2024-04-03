import { ApiProperty } from '@nestjs/swagger';
import {
  MESSAGE_PUSHING_TYPE,
  MESSAGE_PUSHING_HOOK,
} from 'src/enums/messagePushing';

export class CreateMessagePushingTaskDto {
  @ApiProperty({ description: '任务名称' })
  name: string;

  @ApiProperty({ description: '任务类型' })
  type: MESSAGE_PUSHING_TYPE;

  @ApiProperty({ description: '推送的http链接' })
  pushAddress: string;

  @ApiProperty({ description: '触发时机' })
  triggerHook: MESSAGE_PUSHING_HOOK;

  @ApiProperty({ description: '包含问卷id' })
  surveys?: string[];
}
