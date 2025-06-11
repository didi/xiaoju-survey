// server/src/modules/ai/ai.service.ts

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

import { textToSchema } from '../../../utils/textToSchema';
import { questionLoader } from '../../../utils/questionLoader';
import moduleList from '../../../utils/moduleList';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  // systemPrompt：跟你 Python 里那段大提示保持一致
  private readonly systemPrompt = `
你是一个问卷设计专家，现在要按照用户需求设计问卷。问卷九种题型和对应格式如下：
1、单行输入框:
题目内容[单行输入框]

2、多行输入框:
题目内容[多行输入框]

3、单选:
题目内容[单选]
选项1
选项2

4、多选:
题目内容[多选]
选项1
选项2

5、判断题:
题目内容[判断题]
对
错

6、评分:
题目内容[评分]

7、NPS评分:
题目内容[NPS评分]
极不满意-十分满意

8、多级联动:
题目内容[多级联动]

9、投票题:
题目内容[投票]
选型1
选项2

要求：请按照用户说的调查对象、调查目的生成包含**用户指定题数**的问卷，题目必须按照对应格式生成，题目前不要写序号，题和题之间用**空行**分开，问卷文字不要包含任何markdown语法，只返回问卷内容，不要返回任何其它内容。
用户需求如下：
`;

// OpenRouter 的 API Key，请从环境变量里读取
private readonly apiKey = process.env.OPENROUTER_API_KEY || '';

// OpenRouter 请求的基础 URL
private readonly openRouterUrl = 'https://openrouter.ai/api/v1/chat/completions';

constructor(private readonly httpService: HttpService) {
  this.apiKey = process.env.OPENROUTER_API_KEY ?? '';
  console.log('🗝️  [AiService] raw process.env.OPENROUTER_API_KEY =', process.env.OPENROUTER_API_KEY);
  console.log('🗝️  [AiService] this.apiKey                =', this.apiKey);
  this.logger.log(`→ OpenRouter API Key is: ${this.apiKey ? '✅_PRESENT' : '❌_MISSING'}`);
}

async onModuleInit() {
  
  const allTypes = Object.keys(moduleList);
  await questionLoader.init({ typeList: allTypes });

  // 日志打印每个题型的 meta
  allTypes.forEach((type) => {
    const meta = questionLoader.getMeta(type);
    this.logger.log(`Loaded meta for ${type}: ${JSON.stringify(meta)}`);
  });
  this.logger.log(`✅ AI Service 初始化完毕，已加载 ${allTypes.length} 个题型的 meta`);

}

/**
* 根据用户传来的 demand 调用 OpenRouter，返回原始的问卷文本，
* 然后再对文本调用 textToSchema 生成结构化数组并返回给 Controller。
*/
async generateQuestions(demand: string): Promise<Array<Record<string, any>>> {
  this.logger.log(`→ [DEBUG] Using OPENROUTER_API_KEY: "${this.apiKey}"`);
  
  if (!this.apiKey) {
    throw new Error('Missing OPENROUTER_API_KEY');
  }
    const fullPrompt = this.systemPrompt + demand;

    const maxRetries = 3;
    let attempt = 0;
    let waitMs = 0;
    let lastError: Error | null = null;
    let aiContent = '';

    while (attempt < maxRetries) {
      attempt++;
      try {
        // 请求体跟你 Python 版基本一致
        const requestBody = {
          model: 'deepseek/deepseek-chat-v3-0324:free',
          messages: [{ role: 'user', content: fullPrompt }],
          temperature: 0.4,
          reasoning: { effort: 'high' },
        };

        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        };

        // 发起 POST 请求
        const response: AxiosResponse<any> = await firstValueFrom(
          this.httpService.post(this.openRouterUrl, requestBody, { headers }),
        );

        console.log('🖨️  [OpenRouter Response]:', JSON.stringify(response.data, null, 2));

        const result = response.data;
        // 如果 OpenRouter 返回了 error
        if (result.error) {
          const errorCode = result.error.code;
          // 处理 429: 限流，尝试读 X-RateLimit-Reset
          if (errorCode === 429) {
            this.logger.warn(`第 ${attempt} 次遭遇 429 限流: ${JSON.stringify(result.error)}`);

            let resetTsMs: number | null = null;
            try {
              // 有时在 metadata.headers 里会有 X-RateLimit-Reset
              resetTsMs = parseInt(result.error.metadata.headers['X-RateLimit-Reset'], 10);
            } catch {
              resetTsMs = null;
            }

            if (resetTsMs) {
              const nowMs = Date.now();
              waitMs = resetTsMs - nowMs + 1000; // 多加一秒缓冲
              if (waitMs < 0) waitMs = 5000; // 最少等 5 秒
            } else {
              waitMs = 5000;
            }
            this.logger.log(`等待 ${waitMs / 1000}s 后重试`);
            await this.delay(waitMs);
            continue;
          } else {
            // 其他错误，直接抛
            throw new Error(`OpenRouter 返回错误：${JSON.stringify(result.error)}`);
          }
        }

        // 如果没有 choices 或者内容不符合预期
        if (!result.choices || !Array.isArray(result.choices) || result.choices.length === 0) {
          throw new Error(`OpenRouter 返回内容异常：${JSON.stringify(result)}`);
        }

        // 取第一个 message 内容
        aiContent = result.choices[0].message.content;

        // —— 新增这行，打印原始字符串，便于对照 textToSchema 的逻辑
        this.logger.debug('→ [DEBUG] Raw AI content:\n' + aiContent);

        // 调用前端的 textToSchema 把纯文本转成结构化问卷
        const questionSchemaArray = textToSchema(aiContent);
        return questionSchemaArray;
      } catch (err: any) {
        // 捕获网络异常、解析异常等
        lastError = err instanceof Error ? err : new Error(String(err));
        this.logger.error(`第 ${attempt} 次请求失败: ${lastError.message || err}`);
        // 如果是解析异常，也打印原始 aiContent
        if (attempt === 1 || lastError.message.includes('该题目配置不存在')) {
          this.logger.error('Raw content was:\n' + (aiContent || '[no content]'));
          this.logger.error('解析错误：' + lastError.message);
        }
        if (attempt >= maxRetries) {
          throw new Error(`AI 生成连续失败 ${maxRetries} 次，${err.message}`);
        }
        // 等待几百毫秒后重试
        await this.delay(2000);
      }
    }

    // 如果走到这里，说明重试用完了
    throw new Error(`AI 生成问卷失败：已尝试 ${maxRetries} 次`);
  }

  /** 简单的延迟函数 */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
