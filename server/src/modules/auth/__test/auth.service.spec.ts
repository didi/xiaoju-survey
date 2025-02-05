import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/models/user.entity';

import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(),
    verify: jest.fn().mockReturnValue({}),
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

      await service.generateToken(userData);
    });
  });

  describe('verifyToken', () => {
    it('should verifyToken succeed', async () => {
      const token = 'mock token';
      jest
        .spyOn(userService, 'getUserByUsername')
        .mockResolvedValue({} as User);
      await service.verifyToken(token);
      expect(userService.getUserByUsername).toHaveBeenCalledTimes(1);
    });
  });
});
