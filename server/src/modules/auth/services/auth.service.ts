import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { sign, verify } from 'jsonwebtoken';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}
  async generateToken(
    { _id, username }: { _id: string; username: string },
    { secret, expiresIn }: { secret: string; expiresIn: string },
  ) {
    return sign({ _id, username }, secret, {
      expiresIn,
    });
  }

  async verifyToken(token: string) {
    let decoded;
    try {
      decoded = verify(
        token,
        this.configService.get<string>('XIAOJU_SURVEY_JWT_SECRET'),
      );
    } catch (err) {
      throw new Error('用户凭证错误');
    }
    const user = await this.userService.getUserByUsername(decoded.username);
    if (!user) {
      throw new Error('用户不存在');
    }
    return user;
  }

  async expiredCheck(token: string) {
    let decoded;
    try {
      decoded = verify(
        token,
        this.configService.get<string>('XIAOJU_SURVEY_JWT_SECRET'),
      );
    } catch (err) {
      return true;
    }
    return false;
  }
}
