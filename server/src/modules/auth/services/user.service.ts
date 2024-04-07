import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from 'src/models/user.entity';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';
import { hash256 } from 'src/utils/hash256';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) {}

  async createUser(userInfo: {
    username: string;
    password: string;
  }): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { username: userInfo.username },
    });

    if (existingUser) {
      throw new HttpException('该用户已存在', EXCEPTION_CODE.USER_EXISTS);
    }

    const newUser = this.userRepository.create({
      username: userInfo.username,
      password: hash256(userInfo.password),
    });

    return this.userRepository.save(newUser);
  }

  async getUser(userInfo: {
    username: string;
    password: string;
  }): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: {
        username: userInfo.username,
        password: hash256(userInfo.password), // Please handle password hashing here
      },
    });

    return user;
  }

  async getUserByUsername(username) {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });

    return user;
  }
}
