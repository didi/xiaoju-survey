// server/src/modules/ai/ai.controller.ts

import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AiService } from '../services/ai.service';

// 定义请求体 DTO
class GenerateDto {
  demand: string; // 用户传来的问卷需求描述
}

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /**
   * POST /ai/generate
   * 接收 { demand: string }，调用 AiService 生成问卷结构并返回
   */
  @Post('generate')
  async generateQuestionnaire(@Body() generateDto: GenerateDto) {
    const { demand } = generateDto;

    if (!demand || typeof demand !== 'string' || !demand.trim()) {
      throw new HttpException('demand 参数不能为空', HttpStatus.BAD_REQUEST);
    }

    try {
      // 调用 Service 层生成
      const questions = await this.aiService.generateQuestions(demand.trim());
      // questions 应该是 Array<Record<string, any>> 格式
      return { success: true, data: questions };
    } catch (err) {
      // 捕获 Service 层抛出的任何异常，返回 500
      throw new HttpException(
        'AI 生成问卷失败: ' + (err?.message || '未知错误'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
