// server/src/modules/ai/__test__/ai.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from '../services/ai.service';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// 1. 第一件事：Mock 掉 textToSchema 模块
jest.mock('../../../utils/textToSchema', () => ({
  textToSchema: (s: string) => JSON.parse(s),
}));

// 2. 放宽测试超时时间，以防重试延迟
jest.setTimeout(20000);

describe('AiService', () => {
  let service: AiService;
  let httpService: HttpService;

  beforeEach(async () => {
    // 3. 完全替换 HttpService，保证网络层可控
    const fakeHttp = { post: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: HttpService, useValue: fakeHttp },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should parse and return schema array when AI 接口返回正常', async () => {
    // 4. 准备一个标准的 AxiosResponse
    const fakeResponse: AxiosResponse = {
      data: { choices: [{ message: { content: '[{"q":"问1"},{"q":"问2"}]' } }] },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} } as InternalAxiosRequestConfig,
    };

    // 5. 每次 post 都返回同样的 Observable，避免 retry 拿到 undefined
    (httpService.post as jest.Mock).mockReturnValue(of(fakeResponse));

    // 6. 调用并断言
    const result = await service.generateQuestions('测试提示');
    expect(result).toEqual([{ q: '问1' }, { q: '问2' }]);
  });

  it('should throw if AI API returns error', async () => {
    // 网络错误，每次 post 都 throw
    (httpService.post as jest.Mock).mockReturnValue(
      throwError(() => new Error('network'))
    );

    await expect(service.generateQuestions('提示')).rejects.toThrow('network');
  });
});
