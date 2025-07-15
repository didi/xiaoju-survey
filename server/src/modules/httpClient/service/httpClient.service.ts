// src/common/http-client/http-client.service.ts
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, catchError, retry } from 'rxjs';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class HttpClientService {
  private readonly logger = new Logger(HttpClientService.name);

  constructor(private readonly http: HttpService) {}

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    data: any = {},
    headers: Record<string, string> = {},
    retryCount = 1,
    signSecret?: string,
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      method,
      url,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (method === 'GET' || method === 'DELETE') {
      config.params = data;
    } else {
      config.data = data;
    }

    try {
      const response = await lastValueFrom(
        this.http.request<T>(config).pipe(
          retry(retryCount),
          catchError((err) => {
            this.logger.error(
              `Request failed: ${method} ${url}`,
              JSON.stringify(err?.response?.data || err.message),
            );
            throw new HttpException(
              'External Request Failed',
              HttpStatus.BAD_GATEWAY,
            );
          }),
        ),
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  get<T>(
    url: string,
    params = {},
    headers = {},
    retryCount = 1,
    signSecret?: string,
  ) {
    return this.request<T>('GET', url, params, headers, retryCount, signSecret);
  }

  post<T>(
    url: string,
    data = {},
    headers = {},
    retryCount = 1,
    signSecret?: string,
  ) {
    return this.request<T>('POST', url, data, headers, retryCount, signSecret);
  }

  put<T>(
    url: string,
    data = {},
    headers = {},
    retryCount = 1,
    signSecret?: string,
  ) {
    return this.request<T>('PUT', url, data, headers, retryCount, signSecret);
  }

  delete<T>(
    url: string,
    params = {},
    headers = {},
    retryCount = 1,
    signSecret?: string,
  ) {
    return this.request<T>(
      'DELETE',
      url,
      params,
      headers,
      retryCount,
      signSecret,
    );
  }
}
