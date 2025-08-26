import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';
import { Logger } from 'src/logger';

const SYSTEM_PROMPT = `你是专业问卷设计专家，请严格按以下格式生成各种题型：
  【格式要求】

  问题内容[单行输入框]

  问题内容[多行输入框]

  问题内容[单选]
  选项1
  选项2

  问题内容[多选]
  选项1
  选项2

  问题内容[判断题]
  肯定判断设定
  否定判断设定


  问题内容[评分]

  问题内容[NPS评分]
  低分设定-高分设定


  问题内容[投票]
  选型1
  选项2

【样例】

  1.您今天早上的早餐是什么？[单行输入框]

  2.您对本频道都有什么建议？[多行输入框]

  3.您对以下哪一种改善心理健康的方法最感兴趣？[单选]
  选项1：心理咨询服务
  选项2：组织心理健康活动
  选项3：加强团队建设
  选项4：调整工作时间安排

  4.您认为早上吃汉堡对身体有益这个观点是对是错？[判断题]
  对
  错

  5.您对本次团建的评价[评分]

  6.您对本次团建的评价[NPS评分]
  很不满意-非常满意

  7.您对班长竞选的投票对象[投票]
  小明
  小红
  小王

【其他要求】
  1.仿照样例，每个问题题目紧后面必须按照样式添加题型标注,题型标注必须用‘[]’来标注，如[单选]、[单行输入框]、[多行输入框]，不要在题型下边再出现题型标注！
  2.仿照样例，题目前面不要标上“问题内容”这几个字，题目前面加上数字序号
  3.单个题目中不能有换行
  4.每道题之间至少要有一行间距
  5.直接输出生成的题目即可，不需要有额外的内容`;

@Injectable()
export class AIGenerateService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  callDeepSeekAPI({
    prompt,
    apiUrl,
    apiKey,
  }: {
    prompt: string;
    apiUrl: string;
    apiKey: string;
  }) {
    try {
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `${prompt}`,
        },
      ];
      return fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.configService.get('AImodel_MODEL'),
          messages,
          temperature: 0.7,
          max_tokens: 512,
          stream: true,
        }),
      });
    } catch (error) {
      this.logger.error('DeepSeek调用失败:', error.message);
      throw new Error(`AI服务调用失败: ${error.message}`);
    }
  }
}
