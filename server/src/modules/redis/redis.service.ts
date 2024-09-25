import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import Redlock, { Lock } from 'redlock';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;
  private readonly redlock: Redlock;

  constructor() {
    this.redisClient = new Redis({
      host: process.env.XIAOJU_SURVEY_REDIS_HOST,
      port: parseInt(process.env.XIAOJU_SURVEY_REDIS_PORT),
      password: process.env.XIAOJU_SURVEY_REDIS_PASSWORD || undefined,
      username: process.env.XIAOJU_SURVEY_REDIS_USERNAME || undefined,
      db: parseInt(process.env.XIAOJU_SURVEY_REDIS_DB) || 0,
    });
    this.redlock = new Redlock([this.redisClient], {
      retryCount: 10,
      retryDelay: 200, // ms
      retryJitter: 200, // ms
    });
  }

  async lockResource(resource: string, ttl: number): Promise<Lock> {
    return this.redlock.acquire([resource], ttl);
  }

  async unlockResource(lock: Lock): Promise<void> {
    await lock.release();
  }
}
