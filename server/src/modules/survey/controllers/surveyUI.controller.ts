import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('ui')
@Controller()
export class SurveyUIController {
  constructor() {}

  @Get('/')
  home(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'management.html'));
  }

  @Get('/management/:path*')
  management(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'management.html'));
  }
}
