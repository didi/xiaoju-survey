import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Query,
  Request,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../services/user.service';
import { CaptchaService } from '../services/captcha.service';
import { AuthService } from '../services/auth.service';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { create } from 'svg-captcha';
import { ApiTags } from '@nestjs/swagger';

const passwordReg = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/;

@ApiTags('auth')
@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    readonly captchaService: CaptchaService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  @HttpCode(200)
  async register(
    @Body()
    userInfo: {
      username: string;
      password: string;
      captchaId: string;
      captcha: string;
    },
  ) {
    if (!userInfo.password) {
      throw new HttpException('密码无效', EXCEPTION_CODE.PASSWORD_INVALID);
    }

    if (userInfo.password.length < 6 || userInfo.password.length > 16) {
      throw new HttpException(
        '密码长度在 6 到 16 个字符',
        EXCEPTION_CODE.PASSWORD_INVALID,
      );
    }

    if (!passwordReg.test(userInfo.password)) {
      throw new HttpException(
        '密码只能输入数字、字母、特殊字符',
        EXCEPTION_CODE.PASSWORD_INVALID,
      );
    }

    const isCorrect = await this.captchaService.checkCaptchaIsCorrect({
      captcha: userInfo.captcha,
      id: userInfo.captchaId,
    });

    if (!isCorrect) {
      throw new HttpException('验证码不正确', EXCEPTION_CODE.CAPTCHA_INCORRECT);
    }

    const user = await this.userService.createUser({
      username: userInfo.username,
      password: userInfo.password,
    });

    const token = await this.authService.generateToken(
      {
        username: user.username,
        _id: user._id.toString(),
      },
      {
        secret: this.configService.get<string>('XIAOJU_SURVEY_JWT_SECRET'),
        expiresIn: this.configService.get<string>(
          'XIAOJU_SURVEY_JWT_EXPIRES_IN',
        ),
      },
    );
    // 验证过的验证码要删掉，防止被别人保存重复调用
    this.captchaService.deleteCaptcha(userInfo.captchaId);
    return {
      code: 200,
      data: {
        token,
        username: user.username,
      },
    };
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body()
    userInfo: {
      username: string;
      password: string;
      captchaId: string;
      captcha: string;
    },
  ) {
    const isCorrect = await this.captchaService.checkCaptchaIsCorrect({
      captcha: userInfo.captcha,
      id: userInfo.captchaId,
    });

    if (!isCorrect) {
      throw new HttpException('验证码不正确', EXCEPTION_CODE.CAPTCHA_INCORRECT);
    }

    const username = await this.userService.getUserByUsername(
      userInfo.username,
    );
    if (!username) {
      throw new HttpException(
        '账号未注册，请进行注册',
        EXCEPTION_CODE.USER_NOT_EXISTS,
      );
    }

    const user = await this.userService.getUser({
      username: userInfo.username,
      password: userInfo.password,
    });
    if (user === null) {
      throw new HttpException(
        '用户名或密码错误',
        EXCEPTION_CODE.USER_PASSWORD_WRONG,
      );
    }
    let token;
    try {
      token = await this.authService.generateToken(
        {
          username: user.username,
          _id: user._id.toString(),
        },
        {
          secret: this.configService.get<string>('XIAOJU_SURVEY_JWT_SECRET'),
          expiresIn: this.configService.get<string>(
            'XIAOJU_SURVEY_JWT_EXPIRES_IN',
          ),
        },
      );
      // 验证过的验证码要删掉，防止被别人保存重复调用
      this.captchaService.deleteCaptcha(userInfo.captchaId);
    } catch (error) {
      throw new Error(
        'generateToken erro:' +
          error.message +
          this.configService.get<string>('XIAOJU_SURVEY_JWT_SECRET') +
          this.configService.get<string>('XIAOJU_SURVEY_JWT_EXPIRES_IN'),
      );
    }

    return {
      code: 200,
      data: {
        token,
        username: user.username,
      },
    };
  }

  @Post('/captcha')
  @HttpCode(200)
  async getCaptcha(): Promise<{
    code: number;
    data: { id: string; img: string };
  }> {
    const captchaData = create({
      size: 4, // 验证码长度
      ignoreChars: '0o1i', // 忽略字符
      noise: 3, // 干扰线数量
      color: true, // 启用彩色
      background: '#f0f0f0', // 背景色
    });
    const res = await this.captchaService.createCaptcha(captchaData.text);

    return {
      code: 200,
      data: {
        id: res._id.toString(),
        img: captchaData.data,
      },
    };
  }

  /**
   * 密码强度
   */
  @Get('/password/strength')
  @HttpCode(200)
  async getPasswordStrength(@Query('password') password: string) {
    const numberReg = /[0-9]/.test(password);
    const letterReg = /[a-zA-Z]/.test(password);
    const symbolReg = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    // 包含三种、且长度大于8
    if (numberReg && letterReg && symbolReg && password.length >= 8) {
      return {
        code: 200,
        data: 'Strong',
      };
    }

    // 满足任意两种
    if ([numberReg, letterReg, symbolReg].filter(Boolean).length >= 2) {
      return {
        code: 200,
        data: 'Medium',
      };
    }

    return {
      code: 200,
      data: 'Weak',
    };
  }

  @Get('/verifyToken')
  @HttpCode(200)
  async verifyToken(@Request() req) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return {
        code: 200,
        data: false,
      };
    }
    try {
      await this.authService.verifyToken(token);
      return {
        code: 200,
        data: true,
      };
    } catch (error) {
      return {
        code: 200,
        data: false,
      };
    }
  }
}
