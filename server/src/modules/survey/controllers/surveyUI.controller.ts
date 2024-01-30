import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class SurveyUIController {
  constructor() {}

  @Get('/')
  home(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'management.html'));
  }

  @Get('/management/:surveyId')
  management(@Param('surveyId') surveyId: string, @Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'management.html'));
  }
}
