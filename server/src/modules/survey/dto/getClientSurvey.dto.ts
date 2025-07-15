import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

export class GetClientSurveyDto {
  @ApiProperty({ description: 'surveyIds', type: [String] })
  surveyIds: string[];

  static validate(data: any) {
    return Joi.object({
      surveyIds: Joi.array().items(Joi.string()).required(),
    }).validate(data, { allowUnknown: true });
  }
}
