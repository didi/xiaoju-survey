import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { OpenAuthGuard } from '../openAuth.guard';
import { AppManagerService } from '../../modules/appManager/services/appManager.service';
import { APPList } from 'src/modules/appManager/appConfg';
import { HttpException } from '../../exceptions/httpException';
import { EXCEPTION_CODE } from '../../enums/exceptionCode';

describe('OpenAuthGuard', () => {
  let guard: OpenAuthGuard;
  let appManagerService: AppManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenAuthGuard,
        {
          provide: AppManagerService,
          useValue: {
            checkAppManager: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    guard = module.get<OpenAuthGuard>(OpenAuthGuard);
    appManagerService = module.get<AppManagerService>(AppManagerService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true for valid credentials', async () => {
      const validateToken = 'eyJhbGciOiJIUzI1NiJ9.MmJBcHBpZA.0y_-HxkRGCDEFNkdQ1xsi41mH5u8J22836I5BWhibdM';
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              'x-app-id': APPList[0].appId,
              'x-app-token': validateToken,
            },
          }),
        }),
      } as ExecutionContext;

      const result = await guard.canActivate(mockContext);
      expect(result).toBe(true);
      expect(appManagerService.checkAppManager).toHaveBeenCalledWith(
        APPList[0].appId,
        'eyJhbGciOiJIUzI1NiJ9.MmJBcHBpZA.0y_-HxkRGCDEFNkdQ1xsi41mH5u8J22836I5BWhibdM',
      );
    });

    it('should return false for missing headers', async () => {
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {},
          }),
        }),
      } as ExecutionContext;

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        new HttpException('Missing required parameters', EXCEPTION_CODE.PARAMETER_ERROR)
      );
      expect(appManagerService.checkAppManager).not.toHaveBeenCalled();
    });

    it('should return false for invalid credentials', async () => {
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              'x-app-id': 'invalid-app-id',
              'x-app-token': 'invalid-token',
            },
          }),
        }),
      } as ExecutionContext;

      jest.spyOn(appManagerService, 'checkAppManager').mockResolvedValueOnce(false);

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        new HttpException('Invalid appId', EXCEPTION_CODE.PARAMETER_ERROR)
      );
      expect(appManagerService.checkAppManager).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              'x-app-id': 'error-app-id',
              'x-app-token': 'error-token',
            },
          }),
        }),
      } as ExecutionContext;

      jest.spyOn(appManagerService, 'checkAppManager').mockRejectedValueOnce(new Error('Test error'));

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        new HttpException('Invalid appId', EXCEPTION_CODE.PARAMETER_ERROR)
      );
    });
  });
}); 