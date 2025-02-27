import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { APPList } from '../modules/appManager/appConfg';
import { AppManagerService } from '../modules/appManager/services/appManager.service';
import { Logger } from '../logger';

@Injectable()
export class OpenAuthGuard implements CanActivate {
  constructor(
    private readonly appManagerService: AppManagerService,
    private readonly logger: Logger
  ) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { headers } = request;

    const appId = headers['x-app-id'];
    const appToken = headers['x-app-oken'];
    this.logger.info('OpenAuthGuard checking:');

    if (!appId) {
      throw new Error('Missing required parameters');
    }

    if (!APPList.includes(appId)) {
      throw new Error('Invalid appid');
    }
    if(this.appManagerService.checkAppManager(appId, appToken)) {
      return true
    } else {
      throw new Error('Invalid appToken')
    }
  }
}
