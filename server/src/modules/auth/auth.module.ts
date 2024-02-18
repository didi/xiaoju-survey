import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { CaptchaService } from './services/captcha.service';

import { AuthController } from './controllers/auth.controller';

import { User } from 'src/models/user.entity';
import { Captcha } from 'src/models/captcha.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User, Captcha]), ConfigModule],
  controllers: [AuthController],
  providers: [UserService, AuthService, CaptchaService],
  exports: [UserService],
})
export class AuthModule {}
