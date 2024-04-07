import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { sign } from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('generateToken', () => {
    it('should generate token successfully', async () => {
      const userData = { _id: 'mockUserId', username: 'mockUsername' };
      const tokenConfig = {
        secret: 'mockSecretKey',
        expiresIn: '8h',
      };

      await service.generateToken(userData, tokenConfig);

      expect(sign).toHaveBeenCalledWith(userData, tokenConfig.secret, {
        expiresIn: tokenConfig.expiresIn,
      });
    });
  });
});
