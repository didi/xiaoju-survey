import { Controller, Get, HttpCode, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpgradeService } from '../services/upgrade.service';

@ApiTags('survey')
@Controller('/api/upgrade')
export class UpgradeController {
  constructor(private readonly upgradeService: UpgradeService) {}

  @Get('/upgradeFeatureStatus')
  @HttpCode(200)
  async upgradeSubStatus(@Request() req) {
    this.upgradeService.upgradeFeatureStatus();
    return {
      code: 200,
      data: {
        traceId: req.traceId,
      },
    };
  }
}
