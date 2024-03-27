import { Test, TestingModule } from '@nestjs/testing';
import { Authtication } from './authtication';
import { UserService } from '../modules/auth/services/user.service';
import { ConfigService } from '@nestjs/config';
import { AuthtificationException } from '../exceptions/authException';
import { User } from 'src/models/user.entity';
import * as jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('Authtication', () => {
  let guard: Authtication;
  let userService: UserService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Authtication,
        {
          provide: UserService,
          useValue: {
            getUserByUsername: jest.fn(),
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

    guard = module.get<Authtication>(Authtication);
    userService = module.get<UserService>(UserService);
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
      AuthtificationException,
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

    jest.spyOn(jwt, 'verify').mockReturnValue(new Error('token is invalid'));

    jest
      .spyOn(configService, 'get')
      .mockReturnValue('XIAOJU_SURVEY_JWT_SECRET');

    await expect(guard.canActivate(context as any)).rejects.toThrow(
      AuthtificationException,
    );
  });

  it('should throw exception if user does not exist', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer validToken',
          },
        }),
      }),
    };

    const fakeUser = { username: 'testUser' } as User;

    jest.spyOn(jwt, 'verify').mockReturnValue(fakeUser);

    jest
      .spyOn(configService, 'get')
      .mockReturnValue('XIAOJU_SURVEY_JWT_SECRET');
    jest.spyOn(userService, 'getUserByUsername').mockResolvedValue(null);

    await expect(guard.canActivate(context as any)).rejects.toThrow(
      AuthtificationException,
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
    jest.spyOn(userService, 'getUserByUsername').mockResolvedValue(fakeUser);

    jest.spyOn(jwt, 'verify').mockReturnValue(fakeUser);

    const result = await guard.canActivate(context as any);

    expect(result).toBe(true);
    expect(request['user']).toEqual(fakeUser);
  });
});
