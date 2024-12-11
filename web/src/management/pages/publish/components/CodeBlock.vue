<template>
    <div>
      <div class="header">
        <h1>代码示例</h1>
        <el-button type="primary" link>查看API配置项说明</el-button>
        <!-- <a href="www.baidu.com">查看API配置项说明</a> -->
      </div>
      
      <pre><code>{{ code }}</code></pre>
    </div>
  </template>
  
  <script lang="ts" setup>
  
    const code = `import { Survey, SurveyCard } from 'react-native-xiaojusurvey'
  
  // api初始化
  Survey.init({
    host: 'http://127.0.0.1',
    port: '8081',
    channelId: '67598f5b772bdea2b4211e31', // 投放渠道ID
  });
  
  // api调用方式
  Survey.show({
    id: '', // 创建的小桔问卷的activityId
    type: '', // 展示类型
    type: 'dialog',
    onSuccess: () => {},
    onError: (error) => { console.log(error.message) }
  });
  
  Survey.close();
  
  // card组件接入方式
  <SurveyCard
    id=''
    appId=''
    onSuccess={() => {}}
    onError={(error) => { console.log(error.message) }}
  />`
  </script>
  
  <style scoped>
  .header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
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