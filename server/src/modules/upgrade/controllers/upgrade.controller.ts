import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpgradeService } from '../services/upgrade.service';

@ApiTags('survey')
@Controller('/api/upgrade')
export class UpgradeController {
  constructor(private readonly upgradeService: UpgradeService) {}

  @Get('/subStatus')
  @HttpCode(200)
  async upgradeSubStatus() {
    await this.upgradeService.upgradeSubStatus();
    return {
      code: 200,
    };
  }
}
