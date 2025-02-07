import { Controller, Post, Body } from '@nestjs/common';
import { AppManagerService } from '../services/appManager.service';
import { appConfg } from '../appConfg'

@Controller('appManager')
export class AppManagerController {
  constructor(private readonly appManager: AppManagerService) {}

  // 生成 appToken
  @Post('get-token')
  getAppToken() {
    return this.appManager.generateToken(appConfg.appid, appConfg.secret);
  }

  // 认证请求
  @Post('verify')
  verifySignature(
    @Body('appId') appId: string,
    @Body('appToken') appToken: string,
  ) {
    if (!appId || !appToken) {
      return { success: false, error: 'Missing required fields' };
    }

    return this.appManager.checkAppManager(appId, appToken);
  }
}
