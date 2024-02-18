import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class SurveyResponseUIController {
  constructor() {}

  @Get('/render/:surveyPath')
  render(@Param('surveyPath') surveyPath: string, @Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'render.html'));
  }
}
