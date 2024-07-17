<template>
   <el-dialog
    v-model="whiteVisible"
    title="验证"
    :show-close="false"
    class="verify-white-wrap"
    width="315"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    align-center
   
  >
    <template #header>
      <div class="verify-white-head">
        <div class="verify-white-title">验证</div>
        <div v-if="whitelistTip" class="verify-white-tips">{{ whitelistTip }}</div>
      </div>
    </template>
    <div class="verify-white-body">
      <el-input v-if="isPwd" v-model="state.password" class="wd255 mb16"  placeholder="请输入6位字符串类型访问密码"  />
      <el-input v-if="isValue" v-model="state.value" class="wd255 mb16"  :placeholder="placeholder"  />
      <div class="submit-btn" @click="handleSubmit">验证并开始答题</div>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref,reactive,computed,watch} from 'vue'
import { validate } from '../api/survey'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'

const whiteVisible = ref(false)


const store = useStore()
const state = reactive({
  password: '',
  value: '',
  is_submit:false
})

const baseConf = computed(() => store.state.baseConf || {})
const isPwd = computed(() => baseConf.value.passwordSwitch)
const whitelistType = computed(() => baseConf.value.whitelistType)
const memberType = computed(() => baseConf.value.memberType)
const whitelistTip = computed(() => baseConf.value.whitelistTip)
const surveyPath = computed(() => store.state?.surveyPath || '')

const isValue = computed(() => {
  if(!whitelistType.value) return false
 return whitelistType.value!='ALL'
})

const placeholder = computed(() => {
  if (whitelistType.value == 'MEMBER') {
    return '请输入用户名'
  }
  if(memberType.value == 'MOBILE'){
    return '请输入手机号'
  }
  if(memberType.value == 'EMAIL'){
    return '请输入邮箱'
  }
  return ''
})

const handleSubmit = async() => {
  if (state.is_submit) return;
  const params = {
    surveyPath:surveyPath.value
  }
  if (isValue.value) {
    params.whitelist = state.value
  }
  if(isPwd.value){
    params.password = state.password
  }
  const res = await validate(params)
  if (res.code != 200) { 
    ElMessage.error(res.errmsg || '验证失败')
    return
  }
  whiteVisible.value = false
  store.commit('setWhiteData',params)
}

watch(()=>baseConf.value, () => {
  if (whiteVisible.value) return
  if(isValue.value || isPwd.value){
    whiteVisible.value = true;
  }
})


</script>
<style lang="scss" scoped>
.verify-white-wrap{
  .verify-white-body{
    padding:0 14px
  }
  .verify-white-head{
    padding:0 14px;
    margin-bottom: 8px;
    margin-top:2px;
  }
  .mb16{
    margin-bottom:16px;
  }
  .verify-white-tips{
    text-align: center;
    margin-top:8px;
    font-size: 14px;
    color: #92949D;
  }
  .verify-white-title{
    font-size: 16px;
    color: #292A36;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    
  }
  .submit-btn{
    background: #FAA600;
    border-radius: 2px;
    width:255px;
    height:32px;
    color:#fff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top:4px;
    margin-bottom:14px;
  }
}
</style>