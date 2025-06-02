import { Test, TestingModule } from '@nestjs/testing';
import { AppManagerController } from '../controllers/appManager.controller';
import { AppManagerService } from '../services/appManager.service';
import { Logger } from '@nestjs/common';
// import { EXCEPTION_CODE } from '../../../enums/exceptionCode';
// import { HttpException } from 'src/exceptions/httpException';
import { APPList } from '../appConfg';

describe('AppManagerController', () => {
  let controller: AppManagerController;
  let service: AppManagerService;

  // Mock AppManagerService
  const mockAppManagerService = {
    generateToken: jest.fn(),
    checkAppManager: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppManagerController],
      providers: [
        {
          provide: AppManagerService,
          useValue: mockAppManagerService,
        },
        Logger,
      ],
    }).compile();

    controller = module.get<AppManagerController>(AppManagerController);
    service = module.get<AppManagerService>(AppManagerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAppToken', () => {
    it('should generate token successfully', async () => {
      // 准备测试数据
      const mockBody = {
        appId: APPList[0].appId,
        appSecret: APPList[0].appSecret,
      };
      const mockToken =
        'eyJhbGciOiJIUzI1NiJ9.MmJBcHBpZA.0y_-HxkRGCDEFNkdQ1xsi41mH5u8J22836I5BWhibdM';

      // Mock service response
      mockAppManagerService.generateToken.mockResolvedValue(mockToken);

      // 执行测试
      const result = await controller.getAppToken(mockBody);

      // 验证结果
      expect(result).toEqual({
        code: 200,
        data: mockToken,
      });
      expect(service.generateToken).toHaveBeenCalledWith(
        mockBody.appId,
        mockBody.appSecret,
      );
    });
  });

  describe('verifySignature', () => {
    it('should verify signature successfully', async () => {
      // 准备测试数据
      const mockBody = {
        appId: '2bAppid',
        appToken:
          'eyJhbGciOiJIUzI1NiJ9.MmJBcHBpZA.0y_-HxkRGCDEFNkdQ1xsi41mH5u8J22836I5BWhibdM',
      };

      // Mock service response
      mockAppManagerService.checkAppManager.mockResolvedValue(true);

      // 执行测试
      const result = await controller.verifySignature(mockBody);

      // 验证结果
      expect(result).toEqual({
        code: 200,
        success: true,
      });
      expect(service.checkAppManager).toHaveBeenCalledWith(
        mockBody.appId,
        mockBody.appToken,
      );
    });

    it('should handle missing required fields', async () => {
      // 准备测试数据
      const mockBody: any = {
        appId: APPList[0].appId,
        // missing appToken
      };

      // 执行测试
      await expect(controller.verifySignature(mockBody)).rejects.toThrow(Error);
      //   expect(service.checkAppManager).not.toHaveBeenCalled();
    });
  });
});
