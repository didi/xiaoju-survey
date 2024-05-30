import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';
import { MESSAGE_PUSHING_HOOK } from 'src/enums/messagePushing';

export class QueryMessagePushingTaskListDto {
  @ApiProperty({ description: '问卷id', required: false })
  surveyId?: string;

  @ApiProperty({ description: 'hook名称', required: false })
  triggerHook?: MESSAGE_PUSHING_HOOK;

  static validate(data) {
    return Joi.object({
      surveyId: Joi.string().required(),
      triggerHook: Joi.string().required(),
    }).validate(data);
  }
}
