import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { AuthController } from '../controllers/auth.controller';
import { UserService } from '../services/user.service';
import { CaptchaService } from '../services/captcha.service';
import { AuthService } from '../services/auth.service';

import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { ObjectId } from 'mongodb';
import { User } from 'src/models/user.entity';
import { Captcha } from 'src/models/captcha.entity';

jest.mock('../services/captcha.service');
jest.mock('../services/auth.service');
jest.mock('../services/user.service');

describe('AuthController', () => {
  let controller: AuthController;
  let userService: UserService;
  let captchaService: CaptchaService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports: [ConfigModule.forRoot()],
      controllers: [AuthController],
      providers: [UserService, CaptchaService, ConfigService, AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    userService = module.get<UserService>(UserService);
    captchaService = module.get<CaptchaService>(CaptchaService);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a user and return a token when captcha is correct', async () => {
      const mockUserInfo = {
        username: 'testUser',
        password: 'testPassword',
        captchaId: 'testCaptchaId',
        captcha: 'testCaptcha',
      };

      jest
        .spyOn(captchaService, 'checkCaptchaIsCorrect')
        .mockResolvedValue(true);
      jest.spyOn(userService, 'createUser').mockResolvedValue(
        Promise.resolve({
          username: 'testUser',
          _id: new ObjectId(),
        } as User),
      );
      jest.spyOn(authService, 'generateToken').mockResolvedValue('testToken');

      const result = await controller.register(mockUserInfo);

      expect(result).toEqual({
        code: 200,
        data: {
          token: 'testToken',
          username: 'testUser',
        },
      });
    });

    it('should throw HttpException with CAPTCHA_INCORRECT code when captcha is incorrect', async () => {
      const mockUserInfo = {
        username: 'testUser',
        password: 'testPassword',
        captchaId: 'testCaptchaId',
        captcha: 'testCaptcha',
      };

      jest
        .spyOn(captchaService, 'checkCaptchaIsCorrect')
        .mockResolvedValue(false);

      await expect(controller.register(mockUserInfo)).rejects.toThrow(
        new HttpException('验证码不正确', EXCEPTION_CODE.CAPTCHA_INCORRECT),
      );
    });
  });

  describe('login', () => {
    it('should login a user and return a token when captcha is correct', async () => {
      const mockUserInfo = {
        username: 'testUser',
        password: 'testPassword',
        captchaId: 'testCaptchaId',
        captcha: 'testCaptcha',
      };

      jest
        .spyOn(captchaService, 'checkCaptchaIsCorrect')
        .mockResolvedValue(true);
      jest.spyOn(userService, 'getUser').mockResolvedValue(
        Promise.resolve({
          username: 'testUser',
          _id: new ObjectId(),
        } as User),
      );
      jest.spyOn(authService, 'generateToken').mockResolvedValue('testToken');

      const result = await controller.login(mockUserInfo);

      expect(result).toEqual({
        code: 200,
        data: {
          token: 'testToken',
          username: 'testUser',
        },
      });
    });

    it('should throw HttpException with CAPTCHA_INCORRECT code when captcha is incorrect', async () => {
      const mockUserInfo = {
        username: 'testUser',
        password: 'testPassword',
        captchaId: 'testCaptchaId',
        captcha: 'testCaptcha',
      };

      jest
        .spyOn(captchaService, 'checkCaptchaIsCorrect')
        .mockResolvedValue(false);

      await expect(controller.login(mockUserInfo)).rejects.toThrow(
        new HttpException('验证码不正确', EXCEPTION_CODE.CAPTCHA_INCORRECT),
      );
    });

    it('should throw HttpException with USER_NOT_EXISTS code when user is not found', async () => {
      const mockUserInfo = {
        username: 'testUser',
        password: 'testPassword',
        captchaId: 'testCaptchaId',
        captcha: 'testCaptcha',
      };

      jest
        .spyOn(captchaService, 'checkCaptchaIsCorrect')
        .mockResolvedValue(true);
      jest.spyOn(userService, 'getUser').mockResolvedValue(null);

      await expect(controller.login(mockUserInfo)).rejects.toThrow(
        new HttpException('用户名或密码错误', EXCEPTION_CODE.USER_NOT_EXISTS),
      );
    });
  });

  describe('getCaptcha', () => {
    it('should return captcha image and id', async () => {
      const captcha = new Captcha();
      const mockCaptchaId = new ObjectId();
      captcha._id = mockCaptchaId;
      jest.spyOn(captchaService, 'createCaptcha').mockResolvedValue(captcha);

      const result = await controller.getCaptcha();

      expect(result.code).toBe(200);
      expect(result.data.id).toBe(mockCaptchaId.toString());
      expect(typeof result.data.img).toBe('string');
    });
  });
});
