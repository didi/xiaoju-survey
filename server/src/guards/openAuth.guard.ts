import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { APPList } from '../modules/appManager/appConfg';
import { AppManagerService } from '../modules/appManager/services/appManager.service';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';

@Injectable()
export class OpenAuthGuard implements CanActivate {
  constructor(private readonly appManagerService: AppManagerService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { headers } = request;

    const appId = headers['x-app-id'];
    const appToken = headers['x-app-token'];

    if (!appId) {
      throw new HttpException(
        'Missing required appId',
        EXCEPTION_CODE.PARAMETER_ERROR,
      );
    }

    if (!APPList.map((i) => i.appId).includes(appId)) {
      throw new HttpException('Invalid appId', EXCEPTION_CODE.PARAMETER_ERROR);
    }
    try {
      await this.appManagerService.checkAppManager(appId, appToken);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }
}
