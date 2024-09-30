import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { UserService } from '../services/user.service';
import { User } from 'src/models/user.entity';
import { HttpException } from 'src/exceptions/httpException';
import { hash256 } from 'src/utils/hash256';
import { ObjectId } from 'mongodb';

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
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<MongoRepository<User>>(
      getRepositoryToken(User),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

  it('should return null when user is not found by credentials', async () => {
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
      curStatus: { status: 'ACTIVE' },
    } as unknown as User;

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(userInfo);

    const user = await service.getUserByUsername(username);

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: {
        username: username,
      },
    });
    expect(user).toEqual(userInfo);
  });

  it('should return null when user is not found by username', async () => {
    const username = 'nonExistingUser';

    const findOneSpy = jest
      .spyOn(userRepository, 'findOne')
      .mockResolvedValue(null);

    const user = await service.getUserByUsername(username);

    expect(findOneSpy).toHaveBeenCalledWith({
      where: {
        username: username,
      },
    });
    expect(user).toBe(null);
  });

  it('should return a user by id', async () => {
    const id = '60c72b2f9b1e8a5f4b123456';
    const userInfo = {
      _id: new ObjectId(id),
      username: 'testUser',
      curStatus: { status: 'ACTIVE' },
    } as unknown as User;

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(userInfo);

    const user = await service.getUserById(id);

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: {
        _id: new ObjectId(id),
      },
    });
    expect(user).toEqual(userInfo);
  });

  it('should return null when user is not found by id', async () => {
    const id = '60c72b2f9b1e8a5f4b123456';

    const findOneSpy = jest
      .spyOn(userRepository, 'findOne')
      .mockResolvedValue(null);

    const user = await service.getUserById(id);

    expect(findOneSpy).toHaveBeenCalledWith({
      where: {
        _id: new ObjectId(id),
      },
    });
    expect(user).toBe(null);
  });

  it('should return a list of users by username', async () => {
    const username = 'test';
    const userList = [
      { _id: new ObjectId(), username: 'testUser1', createdAt: new Date() },
      { _id: new ObjectId(), username: 'testUser2', createdAt: new Date() },
    ];

    jest
      .spyOn(userRepository, 'find')
      .mockResolvedValue(userList as unknown as User[]);

    const result = await service.getUserListByUsername({
      username,
      skip: 0,
      take: 10,
    });

    expect(userRepository.find).toHaveBeenCalledWith({
      where: {
        username: new RegExp(username),
      },
      skip: 0,
      take: 10,
      select: ['_id', 'username', 'createdAt'],
    });
    expect(result).toEqual(userList);
  });

  it('should return a list of users by ids', async () => {
    const idList = ['60c72b2f9b1e8a5f4b123456', '60c72b2f9b1e8a5f4b123457'];
    const userList = [
      {
        _id: new ObjectId(idList[0]),
        username: 'testUser1',
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(idList[1]),
        username: 'testUser2',
        createdAt: new Date(),
      },
    ];

    jest
      .spyOn(userRepository, 'find')
      .mockResolvedValue(userList as unknown as User[]);

    const result = await service.getUserListByIds({ idList });

    expect(userRepository.find).toHaveBeenCalledWith({
      where: {
        _id: {
          $in: idList.map((id) => new ObjectId(id)),
        },
      },
      select: ['_id', 'username', 'createdAt'],
    });
    expect(result).toEqual(userList);
  });
});
