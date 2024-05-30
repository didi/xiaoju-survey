import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { GetUserListDto } from '../dto/getUserList.dto';
import { Authentication } from 'src/guards/authentication.guard';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { User } from 'src/models/user.entity';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUserListByUsername: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(Authentication)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('getUserList', () => {
    it('should return a list of users', async () => {
      const mockUserList = [
        { _id: '1', username: 'user1' },
        { _id: '2', username: 'user2' },
      ];

      jest
        .spyOn(userService, 'getUserListByUsername')
        .mockResolvedValue(mockUserList as unknown as User[]);

      const queryInfo: GetUserListDto = {
        username: 'testuser',
        pageIndex: 1,
        pageSize: 10,
      };
      GetUserListDto.validate = jest
        .fn()
        .mockReturnValue({ value: queryInfo, error: null });

      const result = await userController.getUserList(queryInfo);

      expect(result).toEqual({
        code: 200,
        data: mockUserList.map((item) => ({
          userId: item._id,
          username: item.username,
        })),
      });
    });

    it('should throw an HttpException if validation fails', async () => {
      const queryInfo: GetUserListDto = {
        username: 'testuser',
        pageIndex: 1,
        pageSize: 10,
      };
      const validationError = new Error('Validation failed');

      GetUserListDto.validate = jest
        .fn()
        .mockReturnValue({ value: null, error: validationError });

      await expect(userController.getUserList(queryInfo)).rejects.toThrow(
        new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR),
      );
    });
  });
});
