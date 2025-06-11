// server/src/modules/ai/__test__/ai.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from '../controllers/ai.controller';
import { AiService } from '../services/ai.service';

describe('AiController', () => {
  let controller: AiController;
  let service: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [
        {
          provide: AiService,
          useValue: {
            generateQuestions: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AiController>(AiController);
    service = module.get<AiService>(AiService);
  });

  it('POST /ai/generate 成功时返回 { success: true, data }', async () => {
    const mockData = [{ foo: 'bar' }];
    (service.generateQuestions as jest.Mock).mockResolvedValueOnce(mockData);

    const response = await controller.generateQuestionnaire({ demand: '测试' });
    expect(response).toEqual({ success: true, data: mockData });
  });

  it('POST /ai/generate 参数校验不通过时抛 400', async () => {
    await expect(
      controller.generateQuestionnaire({ demand: '' })
    ).rejects.toMatchObject({ status: 400 });
  });

  it('Service 抛错时返回 500', async () => {
    (service.generateQuestions as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    await expect(
      controller.generateQuestionnaire({ demand: '有效提示' })
    ).rejects.toMatchObject({ status: 500, response: expect.stringContaining('fail') });
  });
});
