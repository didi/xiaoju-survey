import {
  Controller,
  Get,
  Post,
  Query,
  HttpCode,
  UseGuards,
  Request,
  Headers,
} from '@nestjs/common';

import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Authentication } from 'src/guards/authentication.guard';

import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { HttpException } from 'src/exceptions/httpException';

import { UserService } from '../services/user.service';
import { GetUserListDto } from '../dto/getUserList.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('user')
@ApiBearerAuth()
@Controller('/api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(Authentication)
  @Get('/getUserList')
  @HttpCode(200)
  async getUserList(
    @Query()
    queryInfo: GetUserListDto,
  ) {
    const { value, error } = GetUserListDto.validate(queryInfo);
    if (error) {
      throw new HttpException('参数有误', EXCEPTION_CODE.PARAMETER_ERROR);
    }

    const userList = await this.userService.getUserListByUsername({
      username: value.username,
      skip: (value.pageIndex - 1) * value.pageSize,
      take: value.pageSize,
    });

    return {
      code: 200,
      data: userList.map((item) => {
        return {
          userId: item._id.toString(),
          username: item.username,
        };
      }),
    };
  }

  @UseGuards(Authentication)
  @Get('/getUserInfo')
  async getUserInfo(@Request() req) {
    return {
      code: 200,
      data: {
        userId: req.user._id.toString(),
        username: req.user.username,
      },
    };
  }

  @UseGuards(Authentication)
  @Post('/getUsers')
  async getUsers() {
    return {
      code: 200,
      data: await this.userService.findAll(),
    };
  }

  // 通过token获取个人信息
  @UseGuards(Authentication)
  @Post('/getUserInfoV2')
  async getUserInfoV2(@Headers('authorization') authHeader: string) {
    console.log('Authorization Header:', authHeader);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_schema, credential] = authHeader?.split(' ') ?? [];
    const user = await this.authService.verifyToken(credential);
    return {
      code: 200,
      data: {
        userId: user._id.toString(),
        username: user.username,
      },
    };
  }
}
