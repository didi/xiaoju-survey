import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('ui')
@Controller()
export class SurveyResponseUIController {
  constructor() {}

  @Get('/render/:path*')
  render(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'render.html'));
  }
}
