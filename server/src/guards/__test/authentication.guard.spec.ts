import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Authentication } from '../authentication.guard';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { AuthenticationException } from 'src/exceptions/authException';
import { User } from 'src/models/user.entity';

jest.mock('jsonwebtoken');

describe('Authentication', () => {
  let guard: Authentication;
  let authService: AuthService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Authentication,
        {
          provide: AuthService,
          useValue: {
            verifyToken: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<Authentication>(Authentication);
    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should throw exception if token is not provided', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    };

    await expect(guard.canActivate(context as any)).rejects.toThrow(
      AuthenticationException,
    );
  });

  it('should throw exception if token is invalid', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer invalidToken',
          },
        }),
      }),
    };

    jest
      .spyOn(authService, 'verifyToken')
      .mockRejectedValue(new Error('token is invalid'));

    jest
      .spyOn(configService, 'get')
      .mockReturnValue('XIAOJU_SURVEY_JWT_SECRET');

    await expect(guard.canActivate(context as any)).rejects.toThrow(
      AuthenticationException,
    );
  });

  it('should set user in request object and return true if user exists', async () => {
    const request = {
      headers: {
        authorization: 'Bearer validToken',
      },
    };
    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    };

    const fakeUser = { username: 'testUser' } as User;
    jest
      .spyOn(configService, 'get')
      .mockReturnValue('XIAOJU_SURVEY_JWT_SECRET');
    jest.spyOn(authService, 'verifyToken').mockResolvedValue(fakeUser);

    const result = await guard.canActivate(context as any);

    expect(result).toBe(true);
    expect(request['user']).toEqual(fakeUser);
  });
});
