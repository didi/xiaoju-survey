import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AIGenerateService } from '../services/ai-generate.service';
// import { SurveyConfService } from '../services/survey-conf.service';
import type { Response } from 'express';

@Controller('/api/ai-generate')
@ApiTags('survey')
export class AIGenerateController {
  constructor(
    private readonly aiService: AIGenerateService,
  ) {}

@Post('test-deepseek')
  async testDeepSeek(
    @Body() body: { prompt: string },
    @Res() res: Response
  ) {
    try {
      const result = await this.aiService.callDeepSeekAPI(body.prompt);
      res.status(200).json({
        code: 200,
        data: {
          rawContent: result.rawContent,  // 新增该字段
        }
      });
    } catch (e) {
      console.error('完整错误堆栈:', e.stack);
      res.status(500).json({
        code: 500,
        message: e.message
      });
    }
  }
}
