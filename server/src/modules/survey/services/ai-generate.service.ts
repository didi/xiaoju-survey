import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AIGenerateService {
  private readonly systemPrompt = `你是专业问卷设计专家，请严格按以下格式生成各种题型：
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

  1.你输出的第一句话可以是本次为您生成n个问题，默认保持问题数为5个，如果用户有设置题目数量预期.请严格按照用户的来！
  2.仿照样例，每个问题题目紧后面必须按照样式添加题型标注，如[单选]、[单行输入框]、[多行输入框]，不要在题型下边再出现题型标注！
  3.仿照样例，题目前面不要标上“问题内容”这几个字，题目前面加上数字序号
  4.单个题目中不能有换行，否则就不算是一个题目了
  5.每道题之间至少要有一行间距
  `;
  
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}


  async callDeepSeekAPI(prompt: string) {
    const messages = [
      { role: "system", content: this.systemPrompt },
      { role: "user", content: `下面我将开始描述问题，请根据该内容生成问卷：${prompt}` }
    ];
    try {
      console.log('当前完整的prompt:', messages);  
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
            model: this.configService.get('AImodel_MODEL'),
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
      
    // console.log('DeepSeek原始响应:', JSON.stringify(response.data, null, 2));
    console.log(response.data.choices[0].message.content);
    return {
      rawContent: response.data.choices[0].message.content
    };

    } 
    catch (error) {
      console.error('DeepSeek调用失败:', error.stack);
      throw new Error(`AI服务调用失败: ${error.message}`);
    }

  }
}
