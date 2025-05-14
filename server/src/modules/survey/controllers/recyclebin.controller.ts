import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, HttpCode, Request, UseGuards } from '@nestjs/common';
import { Authentication } from '../../../guards/authentication.guard';
import { SurveyMetaService } from '../services/surveyMeta.service';
import { Logger } from '../../../logger';
import { CollaboratorService } from '../services/collaborator.service';
import { SurveyRecycleBinService } from '../services/surveyRecycleBin.service';

@ApiTags('recycleBin')
@ApiBearerAuth()
@UseGuards(Authentication)
@Controller('/api/recyclebin')
export class RecycleBinController {
  constructor(
    private readonly surveyMetaService: SurveyMetaService,
    private readonly surveyRecycleBinService: SurveyRecycleBinService,
    private readonly logger: Logger,
    private readonly collaboratorService: CollaboratorService,
  ) {}

  @Get()
  @HttpCode(200)
  async count(@Request() req) {
    const userId = req.user._id.toString();
    const total = await this.surveyRecycleBinService.count(userId);
    return {
      code: 200,
      data: {
        total,
      },
    };
  }
}
