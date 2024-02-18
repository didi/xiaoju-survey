import { Injectable } from '@nestjs/common';

import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  async generateToken(
    { _id, username }: { _id: string; username: string },
    { secret, expiresIn }: { secret: string; expiresIn: string },
  ) {
    return sign({ _id, username }, secret, {
      expiresIn,
    });
  }
}
