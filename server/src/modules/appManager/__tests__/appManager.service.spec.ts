import { Test, TestingModule } from '@nestjs/testing';
import { AppManagerService } from '../services/appManager.service';
import { APPList } from '../appConfg';

describe('AppManagerService', () => {
  let service: AppManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppManagerService,
      ],
    }).compile();

    service = module.get<AppManagerService>(AppManagerService)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate token successfully', async () => {
      const appId = APPList[0].appId;
      const appSecret = APPList[0].appSecret;

      const token = await service.generateToken(appId, appSecret);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      
      // 验证token是否被正确存储
      const isValid = await service.checkAppManager(appId, token);
      expect(isValid).toBe(true);
    });
  });

  describe('checkAppManager', () => {
    it('should verify token successfully', async () => {
      const appId = APPList[0].appId;
      const appSecret = APPList[0].appSecret;

      // 先生成token
      const token = await service.generateToken(appId, appSecret);
      
      // 验证token
      const result = await service.checkAppManager(appId, token);
      expect(result).toBe(true);
    });

    // it('should return false for invalid token', async () => {
    //   const appId = APPList[0].appId;
    //   const invalidToken = 'invalid-token';

    //   const result = await service.checkAppManager(appId, invalidToken);
    //   expect(result).toBe(false);
    // });

    // it('should return false for non-existent appId', async () => {
    //   const nonExistentAppId = 'non-existent-app-id';
    //   const token = 'some-token';

    //   const result = await service.checkAppManager(nonExistentAppId, token);
    //   expect(result).toBe(false);
    // });
  });
}); 