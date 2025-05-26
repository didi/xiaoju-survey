<template>
  <div class="ai-generate-container">
    <!-- 整合聊天输入和预览面板 -->
    <div class="generate-content">
      <!-- 左侧聊天输入区域 -->
      <div class="left-panel">      
        <div class="chat-container">
          <div class="panel-background"></div>
          <div v-if="messages.length === 0" class="initial-state">
            <div class="welcome-title">您好，我叫XIAOJU</div>
            <div class="welcome-sub">欢迎使用AI生成问卷！目前，我能够通过自然语言生成基础调研类问卷。例如，我可以生成：</div>
            <div class="example-buttons">
              <div 
                class="example-button"
                @click="handleExampleClick('课程签到问卷')"
              >课程签到问卷</div>
              <div 
                class="example-button"
                @click="handleExampleClick('平台用户满意度调研问卷')"
              >平台用户满意度调研问卷</div>
              <div 
                class="example-button"
                @click="handleExampleClick('奖品发放地址收集问卷')"
              >奖品发放地址收集问卷</div>
          
            </div>
          </div>
          
          <div 
            v-for="(msg, index) in messages" 
            :key="index"
            :class="['message', msg.sender]"
          >
            <img 
              :src="msg.sender === 'user' ? '/imgs/AI/User_Headshot_Round.webp' : '/imgs/AI/XIAOJU_Headshot_Round.webp'" 
              class="avatar"
            />
              <div class="bubble" style="white-space: pre-wrap;">
                <template v-if="msg.content === 'loading'">
                  <span class="dot"></span>
                  <span class="dot"></span>
                  <span class="dot"></span>
                </template>
                <template v-else>
                  {{ msg.content }}
                </template>
                <div 
                  v-if="msg.sender === 'ai' && 
                        msg.content !== 'loading' && 
                        index === lastAIMessageIndex" 
                  class="action-buttons"
                >
                  <div class="action-item" @click="handleRegenerate">
                    <i class="iconfont icon-gengxin"></i>
                    <span>重新生成</span>
                  </div>
                  <div class="action-item">
                    <i class="iconfont icon-zan"></i>
                  </div>
                  <div class="action-item">
                    <i class="iconfont icon-cai"></i>
                  </div>
                </div>
              </div>
          </div>
          
        </div>
        <div class="template-header">
          <i class="iconfont icon-tiwenmoban"></i>
          <span>提问模版</span>
          <div class="tooltip-content">
            <div class="tooltip-header">
              <div class="title">问卷生成万能公式</div>
                <div class="copy-btn" @click="handleCopyTemplate">
                  <i class="iconfont icon-fuzhi"></i>
                  <span>复制</span>
                </div>
            </div>
            <div class="tooltip-text">
              1.输入调研对象：请提供关于您投放对象的描述，例如年龄、性别、职业等。<br>
              2.输入调研品牌(选填)：请提供品牌的名称及相关信息。帮助我们更准确地生成问卷内容。<br>
              3.输入调研目的：请明确您的调查目的，例如：了解产品满意度、客户需求分析、市场竞争格局等。这将引导问卷的整体结构和问题设置。<br>
              4.题目数量期望(选填)：请提供期望的问卷长度范围，便于AI参考（上限12道题）。
            </div>
          </div>
        </div>
        <div class="dialog-area">
          <div class="input-section">


            <el-input
              v-model="prompt"
              type="textarea"
              :rows="5"
              placeholder="请输入您想生成的问卷相关描述（目前暂不支持通过对话修改已生成的问卷）"
              @keydown.enter="handleKeydown"
            />
            <img 
              src="/imgs/AI/icon_Sent.svg" 
              class="send-icon"
              @click="handleGenerate"
            />
          </div>
        </div>
      </div>

      <!-- 右侧预览区域 -->
      <div class="right-panel">
        <MultiSourcePreviewPanel 
        :questionDataList="questionList"
        mode="preview"
      />
        <div class="disclaimer">
          <span class="normal-text">问卷内容由AI生成，无法保证真实准确，仅供参考，请遵守</span>
          <span class="protocol">《AI生成问卷使用协议》</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import axios from 'axios'
import MultiSourcePreviewPanel from '@/management/components/MultiSourcePreviewPanel.vue'
import { textToSchema } from '@/management/utils/textToSchema'
import { ElMessage } from 'element-plus';

const prompt = ref('')
const lastPrompt = ref('')
const messages = ref<Array<{sender: 'user'|'ai', content: string}>>([])
const emit = defineEmits(['change'])

// 生成题目列表
const questionList = computed(() => {
  try {
    const lastAIMessage = [...messages.value].reverse().find(m => m.sender === 'ai')
    return textToSchema(lastAIMessage?.content || '', { showIndex: false })
  } catch (e) {
    return []
  }
})

const handleKeydown = (e: KeyboardEvent) => {
  if (!e.shiftKey) {
    e.preventDefault()
    handleGenerate()
  }
}

const handleGenerate = async () => {
  const currentPrompt = prompt.value.trim()
  if (currentPrompt) {
    lastPrompt.value = currentPrompt 
    messages.value.push({ sender: 'user', content: currentPrompt })
    prompt.value = ''

    const loadingMessage = { sender: 'ai' as const, content: 'loading' }
    messages.value.push(loadingMessage)
    try {
      const response = await axios.post('/api/ai-generate/test-deepseek', {
        prompt: currentPrompt
      })
      
      const aiContent = response.data.data.rawContent.replace(/^\n+/, '')
      
      // 替换加载状态
      const index = messages.value.findIndex(m => m.content === 'loading')
      if (index > -1) {
        messages.value.splice(index, 1, { sender: 'ai', content: aiContent })
        emit('change', textToSchema(aiContent, { showIndex: false })) 
      }
    } catch (error) {
      // 更新加载状态为错误信息
      const index = messages.value.findIndex(m => m.content === 'loading')
      if (index > -1) {
        messages.value.splice(index, 1, { sender: 'ai', content: '生成失败，请稍后再试' })
      }
    }
  }
}

const handleRegenerate = () => {
  if (lastPrompt.value) {
    prompt.value = lastPrompt.value
  }
}


const TEMPLATES = {
  '课程签到问卷': '输入调研对象：大学生\n输入调研目的：课堂效果\n题目数量期望：3道题',
  '平台用户满意度调研问卷': '输入调研对象：平台用户\n输入调研目的：满意度调研\n题目数量期望：5道题',
  '奖品发放地址收集问卷': '输入调研对象：活动中奖用户\n输入调研目的：收集邮寄地址\n题目数量期望：3道题'
} as const;

const handleExampleClick = (type: keyof typeof TEMPLATES) => {
  prompt.value = TEMPLATES[type];
}

const templateContent = ref(`1.输入调研对象：请提供关于您投放对象的描述，例如年龄、性别、职业等。
2.输入调研品牌(选填)：请提供品牌的名称及相关信息。帮助我们更准确地生成问卷内容。
3.输入调研目的：请明确您的调查目的，例如：了解产品满意度、客户需求分析、市场竞争格局等。这将引导问卷的整体结构和问题设置。
4.题目数量期望(选填)：请提供期望的问卷长度范围，便于AI参考（上限12道题）。`);

const handleCopyTemplate = async () => {
  try {
    const copyText = templateContent.value;
    
    // 现代浏览器方案
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(copyText);
    } 
    // 兼容旧版浏览器
    else {
      const textarea = document.createElement('textarea');
      textarea.value = copyText;
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    
    ElMessage.success('复制成功');
  } catch (err) {
    console.error('复制失败:', err);
  }
};

const lastAIMessageIndex = computed(() => {
  // 从后往前找到最后一个AI消息的索引
  for (let i = messages.value.length - 1; i >= 0; i--) {
    if (messages.value[i].sender === 'ai') return i
  }
  return -1
})

</script>

<!-- 合并后的样式 -->
<style lang="scss" scoped>
.ai-generate-container {
  height: 100vh;
  display: flex;
  flex-direction: column;

  .generate-content {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    .left-panel {
      height: calc(100vh - 56px);
      overflow: hidden;
      flex: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: visible; 

      .chat-container {
        flex: 1;
        overflow-y: auto;
        padding: 40px 12px 120px 12px;
        position: relative;
        
        .panel-background {
          height: 20%;
          background: url('/imgs/AI/Gradual_Background.webp') no-repeat;
          background-size: cover;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 0;
        }
        .initial-state {
          position: absolute;
          top: 5%;
          left: 50%;
          width: 100%;  
          transform: translate(-50%, 0);
          text-align: center;
        
          .welcome-title {
            font-family: PingFangSC;
            font-size: 20px;
            background: linear-gradient(259deg, #FDD200 0%, #FAA600 89%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 8px;
          }
          .welcome-sub {
            font-family: PingFangSC;      // 新增字体设置
            font-size: 14px;             // 字号不变
            font-weight: normal;         // 新增字重
            line-height: normal;         // 新增行高
            letter-spacing: normal;      // 新增字间距
            color: #4A4C5B;              // 更新颜色值
          }
          .example-buttons {
            font-family: PingFangSC;
            display: flex;
            gap: 16px;
            margin-top: 24px;
            justify-content: center;

            .example-button {
              padding: 12px 24px;
              border-radius: 6px;
              background: #FEF6E6;
              color: #4A4C5B;
              font-size: 14px;
              font-weight: normal;
              line-height: normal;
              cursor: pointer;
              transition: all 0.2s;
              border: 1px solid #FDD200;
              color: #FAA600;
              &:hover {
                background: #FDD200;
                transform: translateY(-2px);
              }
            }
          }
        }
    
        .message {
          display: flex;
          margin-bottom: 16px;
          
          .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin: 0 8px;
          }
          
          .bubble {
            padding: 12px 16px;
            border-radius: 12px;
            margin: 0 12px;
            width: 80%;
            max-width: 80%;
          }
          
          .dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #FAA600;
            margin: 0 2px;
            animation: dot-bounce 1.4s infinite ease-in-out;

            &:nth-child(2) {
              animation-delay: 0.2s;
            }

            &:nth-child(3) {
              animation-delay: 0.4s;
            }
          }

          @keyframes dot-bounce {
            0%, 80%, 100% { 
              transform: translateY(0);
              opacity: 0.5;
            }
            40% {
              transform: translateY(-6px);
              opacity: 1;
            }
          }

          &.user {
            flex-direction: row-reverse;
            .bubble {
              background: #FEF6E6;
              border: 1px solid #FEF6E6;
              margin-left: auto;
            }
          }
          
          &.ai .bubble {
            background: #F2F4F7;
            border: 1px solid #F2F4F7;
            margin-right: auto;
            position: relative;  
            .action-buttons {
              position: absolute;
              right: 16px;
              bottom: -24px;
              display: flex;
              gap: 16px;
              align-items: center;
              
              .action-item {
                display: flex;
                align-items: center;
                gap: 4px;
                cursor: pointer;
                font-family: PingFangSC;
                font-size: 12px;
                font-weight: normal;
                line-height: 18px;
                letter-spacing: normal;
                color: #FAA600;

                .icon-zan,
                .icon-cai {
                  color: #C8C9CD;
                }   
                
                .iconfont {
                  font-size: 16px;
                }
                
                &:hover {
                  opacity: 0.8;
                }
              }
            }
          }

        }
      }
      .template-header {
        position: relative; 
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 115px 15px;
        z-index: 10;
          .iconfont {
            font-size: 18px;
            color: #FAA600;
          }
          
          span {
            font-family: PingFangSC;
            font-size: 14px;
            font-weight: normal;
            line-height: normal;
            letter-spacing: normal;
            color: #FAA600;
          }
          .tooltip-content {
            display: none;
            position: absolute;
            bottom: 100%;  // 修改定位到标题上方
            margin-bottom: 8px;  // 增加间距
            width: 440px;
            padding: 20px;
            width: 100%;  
            background: #FFFFFF;
            border: 1px solid #F2F4F7;  // 添加边框线
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            border-radius: 8px;
            z-index: 10;
            
            .tooltip-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 16px;
              
              .title {
                font-family: PingFangSC;
                font-size: 18px;
                line-height: 28px;
                color: #292A36;
              }
              
              .copy-btn {
                display: flex;
                align-items: center;
                gap: 4px;
                cursor: pointer;
                
                span {
                  font-family: PingFangSC;
                  font-size: 14px;
                  color: #FAA600;
                }
              }
            }
            
            .tooltip-text {
              font-family: PingFangSC;
              font-size: 14px;
              line-height: 22px;
              color: #666873;
            }
          }
          
          &:hover .tooltip-content {
            display: block;
          }
      }
      .dialog-area {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: #fff;
        z-index: 3;
          &::before {
          content: "enter 发送/command+enter 换行";
          position: absolute;
          top: -24px;
          right: 16px;  // 修改为右侧定位
          left: auto;   // 清除左侧定位
          font-family: PingFangSC;
          font-size: 12px;
          font-weight: normal;
          line-height: 18px;
          color: #C8C9CD;
          letter-spacing: normal;
          text-align: right; // 添加右对齐
        }
        .input-section {
          display: flex;
          background: #f2f4f7;

          :deep(.el-textarea__inner) {
            background: #f2f4f7 !important;
            box-shadow: none !important;
          }
          
          .send-icon {
            width: 64px;
            height: 64px;
            &:hover { filter: brightness(0.9); }
          }
        }
      }
    }

    .right-panel {
        height: calc(100vh - 56px);
        display: flex;
        background: #fff; // 添加背景色
        position: relative; 
        :deep(.multi-source-list) {
          flex-direction: column;  // 修改布局方向
          
          .left-panel {
            display: none !important;  // 隐藏左侧空白面板
          }
          
          .right-panel {
            align-items: flex-start !important;  // 顶部对齐
            width: 100% !important;  // 强制右侧面板全宽
            height: 100%;
            .questions-preview-wrapper {
              width: 100% !important;  // 解除宽度限制
              max-width: none;
              height: 100%;
              margin: auto 0 !important;  // 上下自动间距
            }
          }
        }
        :deep(.material-group .question-title) {
        &::before {
          content: "" !important;
          display: none !important;
        }
        
        // 调整标题间距
        margin-left: 0 !important;
        padding-left: 0 !important;
        }

        .disclaimer {
          position: absolute;
          bottom: 16px;
          left: 0;  // 改为左侧0定位
          right: 0; // 右侧0定位
          text-align: center; // 保持居中
          font-family: PingFangSC;
          font-size: 12px;
          line-height: 18px;
          white-space: normal; // 允许换行
          padding: 0 20px; // 添加边距防止贴边
          .normal-text {
            color: #92949D;
          }
          .protocol {
            color: #FAA600;
          }
        }

    }
  }
}


</style>