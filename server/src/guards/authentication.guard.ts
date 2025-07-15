import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthenticationException } from '../exceptions/authException';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Authentication implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    const [scheme, credential] =
      request.headers.authorization?.split(' ') ?? [];

    const allowedSecretsKeys =
      this.configService.get<string>('ALLOWED_SECRET_KEYS')?.split(',') || [];
    // console.log('scheme===', scheme);
    // console.log('credential===', credential);
    // console.log('allowedSecretsKeys：', allowedSecretsKeys);

    // Secret 免登录, 请勿在前端传递秘钥，会造成泄露
    if (scheme === 'Secret') {
      if (allowedSecretsKeys.includes(credential)) {
        request.user = { id: 'internal', type: 'secret' };
        return true;
      } else {
        throw new AuthenticationException('用户凭证错误');
      }
    }

    if (!token) {
      throw new AuthenticationException('请登录');
    }

    try {
      const user = await this.authService.verifyToken(token);
      request.user = user;
      return true;
    } catch (error) {
      throw new AuthenticationException(error?.message || '用户凭证错误');
    }
  }
}
