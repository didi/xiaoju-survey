import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class CreateTokenDto {
  @ApiProperty({ description: 'appId' })
  appId: string;

  @ApiProperty({ description: 'appSecret' })
  appSecret: string;

  static validate(data) {
    return Joi.object({
      appId: Joi.string(),
      appSecret: Joi.string(),
    }).validate(data, { allowUnknown: true });
  }
}
