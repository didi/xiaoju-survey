import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';
import { CHANNEL_TYPE } from '../../../enums/channel';

export class CreateChannelDto {
  @ApiProperty({ description: '渠道名称', required: true })
  name: string;

  @ApiProperty({ description: '投放方式', required: true })
  type: CHANNEL_TYPE;

  static validate(data) {
    return Joi.object({
      name: Joi.string().required(),
      type: Joi.string()
        .valid(...Object.values(CHANNEL_TYPE))
        .required(),
    }).validate(data, { allowUnknown: true });
  }
}
