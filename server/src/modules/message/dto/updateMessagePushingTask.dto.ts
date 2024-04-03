import { ApiProperty } from '@nestjs/swagger';
import { RECORD_STATUS } from 'src/enums';
import {
  MESSAGE_PUSHING_TYPE,
  MESSAGE_PUSHING_HOOK,
} from 'src/enums/messagePushing';

export class UpdateMessagePushingTaskDto {
  @ApiProperty({ description: '任务名称', required: false })
  name?: string;

  @ApiProperty({ description: '任务类型' })
  type?: MESSAGE_PUSHING_TYPE;

  @ApiProperty({ description: '推送的http链接' })
  pushAddress?: string;

  @ApiProperty({ description: '触发时机' })
  triggerHook?: MESSAGE_PUSHING_HOOK;

  @ApiProperty({ description: '绑定的问卷id', required: false })
  surveys?: string[];

  @ApiProperty({ description: '任务状态', required: false })
  curStatus?: {
    status: RECORD_STATUS;
    date: number;
  };
}
