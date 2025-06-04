import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class VerifyTokenDto {
  @ApiProperty({ description: 'appId', required: true })
  appId: string;

  @ApiProperty({ description: 'appToken', required: true })
  appToken: string;

  static validate(data) {
    return Joi.object({
      appId: Joi.string().required(),
      appToken: Joi.string().required(),
    }).validate(data, { allowUnknown: true });
  }
}
