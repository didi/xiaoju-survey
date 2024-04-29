import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/models/user.entity';

import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(),
    verify: jest.fn(),
  };
});

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        AuthService,
        { provide: UserService, useValue: { getUserByUsername: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  describe('generateToken', () => {
    it('should generate token successfully', async () => {
      const userData = { _id: 'mockUserId', username: 'mockUsername' };
      const tokenConfig = {
        secret: 'mockSecretKey',
        expiresIn: '8h',
      };

      await service.generateToken(userData, tokenConfig);

      expect(jwt.sign).toHaveBeenCalledWith(userData, tokenConfig.secret, {
        expiresIn: tokenConfig.expiresIn,
      });
    });
  });

  describe('verifyToken', () => {
    it('should verifyToken succeed', async () => {
      const token = 'mock token';
      jest.spyOn(jwt, 'verify').mockReturnValueOnce({});
      jest
        .spyOn(userService, 'getUserByUsername')
        .mockResolvedValue({} as User);
      await service.verifyToken(token);
      expect(userService.getUserByUsername).toHaveBeenCalledTimes(1);
    });
  });
});
