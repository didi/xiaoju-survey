import { Injectable } from '@nestjs/common';
import { Mutex } from 'async-mutex';
import { HttpException } from 'src/exceptions/httpException';
import { EXCEPTION_CODE } from 'src/enums/exceptionCode';  

@Injectable()
export class MutexService {
  private mutex = new Mutex();

  async runLocked<T>(callback: () => Promise<T>): Promise<T> {
    // acquire lock
    const release = await this.mutex.acquire();
    try {
      return await callback();
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, EXCEPTION_CODE.RESPONSE_OVER_LIMIT);
      } else {
        throw error;
      }
    } finally {
      release();
    }
  }
}