<template>
    <div>
      <div class="header">
        <h3>方式一： API调用</h3>
        <el-button plain @click="copyCode(code, 'api')" >{{ buttonLabel  }}</el-button>
      </div>
      <pre><code>{{ code }}</code></pre>
      <div class="header">
        <h3>方式二： 组件调用</h3>
        <el-button plain  @click="copyCode(code1, 'component')" >{{ buttonLabel1 }}</el-button>
      </div>
      <pre><code>{{ code1 }}</code></pre>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, toRefs } from 'vue';
  import copy from 'copy-to-clipboard';

  const buttonLabel =ref('复制代码')

  const props = defineProps<{
    surveyPath: {
      type: String;
      required: false;
    };
  }>();
  const { surveyPath } = toRefs(props);
  
    const code = `import { Survey } from 'xiaojusurvey-sdk-rn'
  
  // sdk初始化
  Survey.init({
    host: '', // 请填写你的域名
    port: '', // 请填写你的端口
    appId: '2bAppid'
    channelId: '' // 请填写你的渠道id
  });
  
  // api调用方式
  Survey.show({
    id: '${surveyPath.value || 'xxx'}', // 问卷投放id
    type: 'card',
    onSuccess: () => {},
    onError: (error) => { console.log(error.message) }
  });
  
  Survey.close();
  `
  const buttonLabel1 =ref('复制代码')
  const code1 = `import { Survey, SurveyCard } from 'xiaojusurvey-sdk-rn'

// sdk初始化
Survey.init({
  host: '', // 请填写你的域名
  port: '', // 请填写你的端口
  appId: '2bAppid'
  channelId: '' // 请填写你的渠道id
});

// card组件接入方式
<SurveyCard
  id='${surveyPath.value || 'xxx'}' // 问卷投放id
  type='card'
  onSuccess={() => {}}
  onError={(error) => { console.log(error.message) }}
/>
`
  const copyCode = (content: string, type: string) => {

    const data = copy(content)

    if (data) {
      if(type === 'api') {
        buttonLabel.value = '已复制'
      } else {
        buttonLabel1.value = '已复制'
      }
    }
  };

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