import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class FindChannelDto {
  @ApiProperty({ description: '渠道id', required: true })
  channelId: string;

  static validate(data) {
    return Joi.object({
      channelId: Joi.string().required(),
    }).validate(data, { allowUnknown: true });
  }
}
