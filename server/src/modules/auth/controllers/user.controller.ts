import {
  Controller,
  Get,
  Query,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';

import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Authentication } from 'src/guards/authentication.guard';

import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { HttpException } from 'src/exceptions/httpException';

import { UserService } from '../services/user.service';
import { GetUserListDto } from '../dto/getUserList.dto';

@ApiTags('user')
@ApiBearerAuth()
@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}
