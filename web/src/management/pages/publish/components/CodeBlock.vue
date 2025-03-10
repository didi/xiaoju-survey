<template>
    <div>
      <div class="header">
        <h3>方式一： API调用</h3>
        <el-button plain @click="copyCode('api')" id="api-code" :data-clipboard-text="code">{{ buttonLabel  }}</el-button>
      </div>
      <pre><code>{{ code }}</code></pre>
      <div class="header">
        <h3>方式二： 组件调用</h3>
        <el-button plain  @click="copyCode('component')" id="component-code" :data-clipboard-text="code1">{{ buttonLabel1 }}</el-button>
      </div>
      <pre><code>{{ code1 }}</code></pre>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, toRefs } from 'vue';
  import ClipboardJS from 'clipboard';

  const buttonLabel =ref('复制代码')

  const props = defineProps<{
    surveyPath: {
      type: String;
      required: false;
    };
  }>();
  const { surveyPath } = toRefs(props);
  
    const code = `import { Survey, SurveyCard } from 'xiaojusurvey-sdk-rn'
  
  // sdk初始化
  Survey.init({
    host: 'http://127.0.0.1',
    port: '8081',
    appId: '2bAppid'
    channelId: 'xxx' // 渠道id
  });
  
  // api调用方式
  Survey.show({
    id: '${surveyPath.value || 'xxx'}', // 问卷投放id
    type: 'card', // 展示类型
    onSuccess: () => {},
    onError: (error) => { console.log(error.message) }
  });
  
  Survey.close();
  `
  const buttonLabel1 =ref('复制代码')
  const code1 = `import { Survey } from 'xiaojusurvey-sdk-rn'

// sdk初始化
Survey.init({
  host: 'http://127.0.0.1',
  port: '8081',
  appId: '2bAppid'
  channelId: 'xxx'
});

// card组件接入方式
<SurveyCard
  id='${surveyPath.value || 'xxx'}' // 问卷投放id
  type='card'
  onSuccess={() => {}}
  onError={(error) => { console.log(error.message) }}
/>
`
  const copyCode = (type: string) => {
    
    const clipboard = new ClipboardJS(`#${type}-code`);
    clipboard.on('success', (e) => {
      console.log('代码已复制到剪贴板');
      e.clearSelection();
      if(type === 'api') {
        buttonLabel.value = '已复制'
      } else {
        buttonLabel1.value = '已复制'
      }
    });
    clipboard.on('error', (e) => {
      console.error('复制代码失败');
    });
  };

onMounted(() => {
  // 初始化 clipboard
  new ClipboardJS('.el-button');
});

  </script>
  
  <style scoped>
  .header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0 10px 0;

  }
  pre {
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 5px;
    overflow-x: auto;
  }
  
  code {
    color: #333;
  }
  </style>