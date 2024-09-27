<template>
  <ConfirmDialog
    title="验证"
    :tips="whitelistTip"
    :bodyContent="bodyContent"
    :autoClose="false"
    :cancel="false"
    @confirm="handleSubmit"
  />
</template>
<script setup lang="ts">
import { computed } from 'vue'
import AlertDialog from '../../components/AlertDialog.vue'
import useCommandComponent from '../../hooks/useCommandComponent'
import { validate } from '../../api/survey'
import { useSurveyStore } from '../../stores/survey'

import ConfirmDialog from '../ConfirmDialog.vue'

const alert = useCommandComponent(AlertDialog)

interface Emit {
  (ev: 'confirm'): void
}
const emit = defineEmits<Emit>()

const surveyStore = useSurveyStore()
const { passwordSwitch, whitelistType, memberType, whitelistTip }: any = surveyStore.baseConf || {}

const bodyContent = computed(() => {
  const content = []
  if (passwordSwitch) {
    content.push({
      key: 'password',
      value: '',
      placeholder: '请输入访问密码'
    })
  }
  if (whitelistType && whitelistType != 'ALL') {
    let placeholder = ''
    if (whitelistType == 'MEMBER') {
      placeholder = '请输入用户名'
    }
    if (memberType == 'MOBILE') {
      placeholder = '请输入手机号'
    }
    if (memberType == 'EMAIL') {
      placeholder = '请输入邮箱'
    }

    content.push({
      key: 'whitelist',
      value: '',
      placeholder
    })
  }

  return content
})

const handleSubmit = async (data: { whitelist: string; password: string }, close: Function) => {
  const params: {
    surveyPath: string
    [key: string]: string
  } = {
    surveyPath: surveyStore.surveyPath
  }
  if (data.whitelist) {
    params.whitelist = data.whitelist
  }
  if (data.password) {
    params.password = data.password
  }
  const res: any = await validate(params)

  if (res.code !== 200) {
    alert({ title: res.errmsg || '验证失败' })
    return
  }

  close()
  emit('confirm')
  surveyStore.setWhiteData(params)
}
</script>
<style lang="scss" scoped></style>
