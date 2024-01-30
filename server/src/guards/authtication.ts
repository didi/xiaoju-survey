import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from '../modules/auth/services/user.service';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { AuthtificationException } from '../exceptions/authException';

@Injectable()
export class Authtication implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AuthtificationException('未登录');
    }

    let decoded;
    try {
      decoded = verify(
        token,
        this.configService.get<string>('XIAOJU_SURVEY_JWT_SECRET'),
      );
    } catch (err) {
      throw new AuthtificationException('用户凭证错误');
    }
    const user = await this.userService.getUserByUsername(decoded.username); // 从数据库中查找用户

    if (!user) {
      throw new AuthtificationException('用户不存在');
    }

    request.user = user; // 将用户信息存储在请求中
    return true;
  }
}
