<template>
  <div class="ai-generate-container">
    <!-- 左侧聊天输入区域 -->
    <div class="left-panel">      
      <div class="chat-container" ref="chatContainerRef">
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
        
        <MsgItem 
          v-for="(msg, index) in messages" 
          :key="msg.id"
          :message="msg"
          @regenerate="handleRegenerate(index)"
          @stopGenerating="handleStopGenerating"
          @like="handleLike"
          @dislike="handleDislike"
        />
        
      </div>
      <div class="fn-box">
        <transition name="fade-in-linear">
          <div
            class="formula-wrapper"
            v-show="showQuestionTemplate"
            @mouseenter="onQuestionTemplateEnter"
            @mouseleave="onQuestionTemplateLeave"
          >
            <div class="formula-title">
              <span class="title">问卷生成万能公式</span>
              <span class="copy" @click="handleCopyTemplate">
                复制
              </span>
            </div>
            <p class="formula-tip">
              <span class="bold">1.调研对象：</span>
              <span>请提供关于您投放对象的描述，例如年龄、性别、职业等。 </span>
            </p>
            <p class="formula-tip">
              <span class="bold">2.调研品牌：</span>
              <span>请提供品牌的名称及相关信息。帮助我们更准确地生成问卷内容。</span>
            </p>
            <p class="formula-tip">
              <span class="bold">3.调研目的：</span>
              <span
                >请明确您的调查目的，例如：了解产品满意度、客户需求分析、市场竞争格局等。这将引导问卷的整体结构和问题设置。</span
              >
            </p>
            <p class="formula-tip">
              <span class="bold">4.题目数量：</span>
              <span>请提供期望的问卷长度范围，便于AI参考（上限12道题）。</span>
            </p>
          </div>
        </transition>

        <div class="left-box">
          <div class="formula" @mouseenter="onQuestionTemplateEnter" @mouseleave="onQuestionTemplateLeave">
            <i class="iconfont icon-tixing-yonghuxieyi"></i>
            <span>提问模板</span>
          </div>
        </div>
        <div class="right-box">
          <div class="enter-tip">enter发送 / command+enter换行</div>
        </div>
      </div>
      <div class="dialog-area">
        <div class="input-section">
          <el-input
            class="input"
            :disabled="!canSend"
            ref="inputEl"
            v-model="prompt"
            resize="none"
            type="textarea"
            @input="onInput"
            input-style="height: 114px;box-shadow: none;background: transparent;padding-top: 10px;"
            @keydown="handleKeydown"
            placeholder="请输入您想生成的问卷相关描述（目前暂不支持通过对话修改已生成的问卷）"
          />
          <img 
            src="/imgs/AI/icon_Sent.svg" 
            class="send-icon"
            @click="() => handleGenerate()"
          />
        </div>
      </div>
    </div>

    <!-- 右侧预览区域 -->
    <div class="right-panel">
      <div class="questions-preview-wrapper" :style="{backgroundColor: questionList.length > 0 ? '#fff' : 'transparent'}" >
        <div class="questions-preview-box">
          <div class="diabled-edit-mask"></div>
          <MaterialGroup
            :current-edit-one="parseInt(currentEditOne)"
            :questionDataList="questionList"
          >
          </MaterialGroup>
        </div>
      </div>
      <div class="disclaimer">
        <span class="normal-text">问卷内容由AI生成，无法保证真实准确，仅供参考，请遵守</span>
        <a >《AI生成问卷使用协议》</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, defineEmits } from 'vue'
import { textToSchema } from '@/management/utils/textToSchema'
import { ElMessage } from 'element-plus'
import copy from 'copy-to-clipboard'
import MsgItem from './MsgItem.vue'
import MaterialGroup from '@/management/pages/edit/components/MaterialGroup.vue'
import { nanoid } from 'nanoid'

const messages = ref<Array<{
  id: string,
  sender: 'user'|'ai', 
  content: string, 
  reasoningContent?: string, 
  status?: 'generating'|'finished', 
  showReset?: boolean,
  userInput?: string
}>>([])
const chatContainerRef = ref<HTMLElement | null>(null)
const prompt = ref('')
const lastPrompt = ref('')
const isLoading = ref(false) 
const showQuestionTemplate = ref(false)
const inputEl = ref<any>(null)
let abortController: AbortController | null = null
const currentEditOne = ref('')
const isUserScrolling = ref(false)
const shouldAutoScroll = ref(true)

const emit = defineEmits(['change'])

const questionList = computed(() => {
  try {
    const lastAIMessage = [...messages.value].reverse().find(m => m.sender === 'ai')
    return textToSchema(lastAIMessage?.content || '', { showIndex: false })
  } catch (e) {
    return []
  }
})

const canSend = computed(() => {
  return !isLoading.value
})

const handleKeydown = (event: any) => {
  if (event.isComposing) {
    return
  }
  if (event.key === 'Enter') {
    if (event.metaKey || event.ctrlKey) {
      event.preventDefault()
      const originText = prompt.value
      const textareaEl = inputEl.value.textarea
      const cursorPos = textareaEl.selectionStart
      const textBefore = originText.substring(0, cursorPos)
      const textAfter = originText.substring(cursorPos)
      const newText = `${textBefore}\n${textAfter}`
      prompt.value = newText
      textareaEl.selectionStart = cursorPos + 1
      textareaEl.selectionEnd = cursorPos + 1
    } else {
      handleGenerate()
    }
  }
}

const handleGenerate = async (userInput?: string) => {
  const currentPrompt = userInput || prompt.value.trim()
  if (currentPrompt) {
    isLoading.value = true
    for (let i = 0; i < messages.value.length; i++) {
      messages.value[i].showReset = false
    }
    lastPrompt.value = currentPrompt 
    messages.value.push({ 
      id: nanoid(), 
      sender: 'user', 
      content: currentPrompt,
      userInput: currentPrompt,
      showReset: false,
    })
    
    if (!userInput) {
      prompt.value = ''
    }
    scrollToBottom() // 用户发送后立即滚动

    const loadingMessage = { 
      id: nanoid(),
      sender: 'ai' as const,
      content: 'loading',
      status: 'generating' as const,
      showReset: false,
      userInput: currentPrompt
    }
    messages.value.push(loadingMessage)
    scrollToBottom() 

    const idx = messages.value.length - 1
    
    // 创建新的AbortController
    abortController = new AbortController()
    
    try {
      const response = await fetch('/api/ai-generate/call-deepseek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: currentPrompt
        }),
        signal: abortController.signal
      })
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes("text/event-stream")) {
        if (!response.body) {
          return
        }
        const reader = response.body.getReader()
        const textDecoder = new TextDecoder()

        let output = ''
        let reasoningOutput = ''
        let outputChunk = ''
        await new Promise(resolve => {
          const concatChunkText = async () => {
            try {
              const { done, value }: any = await Promise.race([
                reader.read(),
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    reject(new Error('网络连接超时'))
                  }, 100000)
                }),
              ])
              if (done) {
                emit('change', [...questionList.value])
                return
              }
              const chunkText = textDecoder.decode(value)
              outputChunk += chunkText
              setTimeout(() => {
                concatChunkText()
              }, 20)
            } catch (error: any) {
              if (error.name === 'AbortError') {
                // 用户主动停止生成
                messages.value[idx].content = '生成已停止'
                messages.value[idx].status = 'finished'
                messages.value[idx].showReset = true
              } else {
                messages.value[idx].content += '\n\n网络链接错误，请稍后重试'
                messages.value[idx].status = 'finished'
                messages.value[idx].showReset = true
              }
              resolve(false)
            }
          }

          const handle = async (index: number) => {
            const chunkArr = outputChunk.split('\n').filter(item => !!item)
            let newIndex = 0
            let isDone = false
            for (let i = index; i < chunkArr.length; i++) {
              try {
                const resultChunk = chunkArr[i].replace('data:', '').replace(new RegExp('\xa0', 'g'), '')
                if (resultChunk.indexOf('[DONE]') >= 0) {
                  isDone = true
                  break
                }
                // 为了打字效果加了延时
                await new Promise(forResolve => {
                  setTimeout(() => {
                    forResolve(true)
                  }, 20)
                })
                const chunkJSON = JSON.parse(resultChunk)
                const content = chunkJSON?.choices?.[0]?.delta?.content || ''
                const reasoningContent = chunkJSON?.choices?.[0]?.delta?.reasoning_content || ''
                output += content
                reasoningOutput += reasoningContent
                messages.value[idx].content = output
                if (reasoningOutput) {
                  messages.value[idx].reasoningContent = reasoningOutput
                }
                newIndex = i + 1
              } catch (error) {
                newIndex = i
                break
              }
            }
            if (!isDone) {
              requestIdleCallback(() => {
                handle(newIndex)
              })
            } else {
              resolve(true)
            }
          }
          requestIdleCallback(() => {
            concatChunkText()
            handle(0)
          })
        })
        
        messages.value[idx].status = 'finished'
        messages.value[idx].showReset = true
      } else {
        const res = await response.json()
        messages.value[idx].content = res.errmsg || res.message
        messages.value[idx].status = 'finished'
      }

    } catch (error) {
      // 更新加载状态为错误信息
      const index = messages.value.findIndex(m => m.content === 'loading')
      if (index > -1) {
        let content = ''
        if (messages.value[index].content === 'loading') {
          content = '生成失败，请稍后再试'
        } else {
          content = messages.value[index].content + '\n生成失败，请稍后再试'
        }
        messages.value[index].content = content
        messages.value[index].status = 'finished'
        messages.value[index].showReset = true

      }
    } finally {
      isLoading.value = false 
      abortController = null
    }
  }
}

const handleRegenerate = (index: number) => {
  const message = messages.value[index]
  if (message && message.userInput) {
    messages.value.splice(index - 1, 2)
    handleGenerate(message.userInput)
  }
}

const handleStopGenerating = () => {
  if (abortController) {
    abortController.abort()
  }
}

const handleLike = () => {
  ElMessage({
    type: 'success',
    message: '点赞成功！'
  })
}

const handleDislike = () => {
  ElMessage({
    type: 'warning',
    message: '不喜欢！'
  })
}

const TEMPLATES = {
  '课程签到问卷': '调研对象：大学生\n调研目的：课堂效果\n题目数量期望：3道题',
  '平台用户满意度调研问卷': '调研对象：平台用户\n调研目的：满意度调研\n题目数量期望：5道题',
  '奖品发放地址收集问卷': '调研对象：活动中奖用户\n调研目的：收集邮寄地址\n题目数量期望：3道题'
};

const handleExampleClick = (type: keyof typeof TEMPLATES) => {
  prompt.value = TEMPLATES[type];
}

const templateContentToCopy = `调研对象：请提供关于您投放对象的描述，例如年龄、性别、职业等。
调研品牌：请提供品牌的名称及相关信息。帮助我们更准确地生成问卷内容。
调研目的：请明确您的调查目的，例如：了解产品满意度、客户需求分析、市场竞争格局等。这将引导问卷的整体结构和问题设置。
题目数量期望：请提供期望的问卷长度范围，便于AI参考（上限12道题）。`

const handleCopyTemplate = async () => {
  try {
    const data = copy(templateContentToCopy)
    if (data) {
      ElMessage({
        type: 'success',
        message: '复制成功！'
      })
    }
  } catch (err) {
    console.error('复制失败:', err);
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainerRef.value && shouldAutoScroll.value) {
      chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight
    }
  })
}

const handleScroll = () => {
  if (!chatContainerRef.value) return
  
  const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.value
  const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10 // 10px tolerance
  
  // 如果用户滚动到底部，恢复自动滚动
  if (isAtBottom) {
    shouldAutoScroll.value = true
    isUserScrolling.value = false
  } else {
    // 用户向上滚动，停止自动滚动
    shouldAutoScroll.value = false
    isUserScrolling.value = true
  }
}

// 监听滚动事件
const setupScrollListener = () => {
  nextTick(() => {
    if (chatContainerRef.value) {
      chatContainerRef.value.addEventListener('scroll', handleScroll)
    }
  })
}

// 组件挂载时设置滚动监听
setupScrollListener()

let questionTemplateTimer: any
const onQuestionTemplateEnter = () => {
  clearTimeout(questionTemplateTimer)
  showQuestionTemplate.value = true
}
const onQuestionTemplateLeave = () => {
  questionTemplateTimer = setTimeout(() => {
    showQuestionTemplate.value = false
  }, 300)
}

const onInput = () => {
  prompt.value = prompt.value.slice(0, 300)
}

</script>

<!-- 合并后的样式 -->
<style lang="scss" scoped>
.ai-generate-container {
  min-width: 1280px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  flex: 1;
  overflow: hidden;
}

.left-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;

  .chat-container {
    flex: 1;
    overflow-y: auto;
    padding: 32px 24px 0 24px;
    scroll-behavior: smooth;
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
        font-family: PingFangSC;
        font-size: 14px;
        font-weight: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #4A4C5B;
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
  }
  .fn-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: relative;
    height: 34px;
    padding: 0 24px;
    flex-grow: 0;
    flex-shrink: 0;
    .left-box {
      display: flex;
      align-items: center;
    }
    .formula-wrapper {
      width: 616px;
      height: 244px;
      background: #ffffff;
      border-radius: 8px;
      position: absolute;
      box-shadow: 0px 6px 20px 3px rgba(82, 82, 102, 0.2);
      padding: 16px 24px 24px 24px;
      left: 0;
      top: -246px;
      &::after {
        position: absolute;
        left: 34px;
        top: 244px;
        content: '';
        display: inline-block;
        border-width: 6px;
        border-style: solid;
        border-color: transparent;
        border-bottom-width: 0;
        border-top-color: #fff;
      }
      .formula-title {
        display: flex;
        align-items: center;
        .title {
          font-family: PingFangSC-Medium;
          font-size: 18px;
          color: #292a36;
          text-align: center;
          line-height: 28px;
          font-weight: 500;
        }
      }

      .formula-tip {
        margin-top: 16px;
        text-align: left;
        font-size: 14px;
        color: #4a4c5b;
        .bold {
          font-weight: 600;
        }
      }
    }

    .formula {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #faa600;
      cursor: pointer;
      .iconfont {
        font-size: 14px;
        margin-right: 3px;
      }
      margin-right: 12px;
    }
    .copy {
      display: flex;
      margin-left: 10px;
      align-items: center;
      font-size: 14px;
      color: #faa600;
      cursor: pointer;
    }
    .enter-tip {
      color: rgb(200, 200, 200);
      font-family: PingFangSC-Regular;
      font-size: 12px;
      line-height: 18px;
      font-weight: 400;
    }
  }
  .dialog-area {
    padding: 0 24px 24px 24px;
    .input-section {
      display: flex;
      background: #f2f4f7;
      border-radius: 4px;
      height: 120px;

      .input {
        flex: 1;
        background: transparent;
        font-size: 14px;
      }
      
      .send-icon {
        width: 64px;
        height: 64px;
        margin-top: -4px;
        cursor: pointer;
        &:hover { filter: brightness(0.9); }
      }
    }
  }
}

.right-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  background-color: #f5f8f9;
  .questions-preview-wrapper {
    position: relative;
    width: 375px;
    height: 560px;
    max-height: 80%;
    background-color: #fff;
    overflow-x: hidden;
    overflow-y: auto;
    margin-top: 10%;
  }
  .questions-preview-box {
    position: relative;
  }
  .diabled-edit-mask {
    position: absolute;
    z-index: 999999;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0);
  }
  .disclaimer {
    margin-bottom: 24px;
    a {
      cursor: pointer;
      color: #ffa600;
    }
  }
}

</style>