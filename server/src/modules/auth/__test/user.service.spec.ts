import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { UserService } from '../services/user.service';
import { User } from 'src/models/user.entity';
import { HttpException } from 'src/exceptions/httpException';
import { hash256 } from 'src/utils/hash256';

describe('UserService', () => {
  let service: UserService;
  let userRepository: MongoRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<MongoRepository<User>>(
      getRepositoryToken(User),
    );
  });

  it('should create a user', async () => {
    const userInfo = {
      username: 'testUser',
      password: 'testPassword',
    } as User;

    const createSpy = jest
      .spyOn(userRepository, 'create')
      .mockImplementation(() => userInfo);
    const saveSpy = jest
      .spyOn(userRepository, 'save')
      .mockResolvedValue(userInfo);
    const findOneSpy = jest
      .spyOn(userRepository, 'findOne')
      .mockResolvedValue(null);

    const user = await service.createUser(userInfo);

    expect(findOneSpy).toHaveBeenCalledWith({
      where: { username: userInfo.username },
    });
    expect(createSpy).toHaveBeenCalledWith({
      username: userInfo.username,
      password: expect.any(String),
    });
    expect(saveSpy).toHaveBeenCalled();
    expect(user).toEqual(userInfo);
  });

  it('should throw when trying to create an existing user', async () => {
    const userInfo = {
      username: 'existingUser',
      password: 'existingPassword',
    } as User;

    const findOneSpy = jest
      .spyOn(userRepository, 'findOne')
      .mockResolvedValue(userInfo);

    await expect(service.createUser(userInfo)).rejects.toThrow(HttpException);
    expect(findOneSpy).toHaveBeenCalledWith({
      where: { username: userInfo.username },
    });
  });

  it('should return a user by credentials', async () => {
    const userInfo = {
      username: 'existingUser',
      password: 'existingPassword',
    };

    const hashedPassword = hash256(userInfo.password);
    jest.spyOn(userRepository, 'findOne').mockImplementation(() => {
      return Promise.resolve({
        username: userInfo.username,
        password: hashedPassword,
      } as User);
    });

    const user = await service.getUser(userInfo);

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: {
        username: userInfo.username,
        password: hashedPassword,
      },
    });
    expect(user).toEqual({ ...userInfo, password: hashedPassword });
  });

  it('should return undefined when user is not found by credentials', async () => {
    const userInfo = {
      username: 'nonExistingUser',
      password: 'nonExistingPassword',
    };

    const hashedPassword = hash256(userInfo.password);
    const findOneSpy = jest
      .spyOn(userRepository, 'findOne')
      .mockResolvedValue(null);

    const user = await service.getUser(userInfo);

    expect(findOneSpy).toHaveBeenCalledWith({
      where: {
        username: userInfo.username,
        password: hashedPassword,
      },
    });
    expect(user).toBe(null);
  });

  it('should return a user by username', async () => {
    const username = 'existingUser';
    const userInfo = {
      username: username,
      password: 'existingPassword',
    } as User;

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(userInfo);

    const user = await service.getUserByUsername(username);

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { username: username },
    });
    expect(user).toEqual(userInfo);
  });
});
