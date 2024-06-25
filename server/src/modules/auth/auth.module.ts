import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { CaptchaService } from './services/captcha.service';

import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';

import { User } from 'src/models/user.entity';
import { Captcha } from 'src/models/captcha.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { WhitelistService } from './services/whitelist.service';
import { WhitelistVerify } from 'src/models/whitelistVerify.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Captcha, WhitelistVerify]),
    ConfigModule,
  ],
  controllers: [AuthController, UserController],
  providers: [UserService, AuthService, CaptchaService, WhitelistService],
  exports: [UserService, AuthService, WhitelistService],
})
export class AuthModule {}
