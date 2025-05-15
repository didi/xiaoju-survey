import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AIGenerateService {
  private readonly systemPrompt = `你是专业问卷设计专家，请严格按以下格式生成：
  【问卷标题】
  [生成的问卷标题，标题不要带空格]
  
  【问卷问题】
  1. 问题内容
     A) 选项1
     B) 选项2
     C) 选项3
     D) 选项4
  （不加限制的化，默认保持问题数为5个，选项使用大写字母+右括号格式）`;
  
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  private parseAIData(content: string) {
    // 解析示例文本结构
    const lines = content.split('\n').filter(line => line.trim());
    const titleLine = lines.find(line => line.startsWith('【问卷标题】'));
    const result = {
      title: titleLine ? 
        titleLine.replace(/【问卷标题】\s*/, '').trim().replace(/\s+/g, ' ') : 
        '默认问卷标题',
      questions: [] as Array<{title: string, options: string[]}>
    };
  
    let currentQuestion: {title: string, options: string[]} | null = null;
  
    lines.forEach(line => {
      // 修改题目匹配规则（兼容数字后带点或括号的情况）
      const questionMatch = line.match(/^\d+[\.\u3001]\s*(.+)/);
      if (questionMatch) {
        currentQuestion = {
          title: questionMatch[1].replace(/^[-—]\s*/, '').trim(),
          options: []
        };
        result.questions.push(currentQuestion);
        return;
      }
  
      // 修改选项匹配规则（兼容 -、* 等符号开头的情况）
      const optionMatch = line.match(/^[-\*]?\s*([A-E])[\.\u3001]\s*(.+)/);
      if (optionMatch && currentQuestion) {
        const optionLetter = optionMatch[1].toUpperCase();
        currentQuestion.options.push(`${optionLetter}. ${optionMatch[2].trim()}`);
      }
    });
  
    // 添加调试日志
    console.log('解析结果:', JSON.stringify(result, null, 2));
    // 添加中间日志 ↓↓↓
    console.log('原始内容:', content);
    console.log('解析后的标题:', result.title);
    if (result.questions.length === 0) {
      throw new Error('未解析到有效问卷问题');
    }
  
    return result;
  }

  async callDeepSeekAPI(prompt: string) {
    const messages = [
      { role: "system", content: this.systemPrompt },
      { role: "user", content: `请根据以下主题生成问卷：${prompt}` }
    ];
    try {
      const apiUrl = this.configService.get('AImodel_API_URL');
      console.log('当前使用的API地址:', apiUrl);  // 添加这行
      
      const apiKey = this.configService.get('AImodel_API_KEY');
      // 添加密钥部分显示
      console.log('API密钥有效性验证:', 
        apiKey?.slice(0, 6) + 
        '******' + 
        apiKey?.slice(-4)
      );
      
      const response = await lastValueFrom(
        this.httpService.post(
          apiUrl,
          {
            model: "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
            messages: [
              { role: "system", content: this.systemPrompt },
              { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 512
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`, 
              'Content-Type': 'application/json'
            }
          }
        )
        
      );
      
      console.log('DeepSeek原始响应:', JSON.stringify(response.data, null, 2));
    //   return this.parseAIData(JSON.parse(response.data.choices[0].message.content));
    // 修改后：直接使用消息内容，无需二次解析
    return this.parseAIData(response.data.choices[0].message.content);// 添加错误日志
    } catch (error) {
      console.error('DeepSeek调用失败:', error.stack);
      throw new Error(`AI服务调用失败: ${error.message}`);
    }

  }
}
