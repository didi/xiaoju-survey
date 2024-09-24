<template>
  <el-input size="small" v-model="inputValue">
    <template #append>
      <el-upload
        ref="upload"
        class="upload-img"
        action="/api/file/upload"
        :accept="formConfig.accept"
        :limit="1"
        :show-file-list="false"
        :data="{ channel: 'upload' }"
        :on-exceed="handleExceed"
        :headers="{
          Authorization: `Bearer ${token}`
        }"
        :before-upload="beforeAvatarUpload"
        :on-success="onSuccess"
      >
        <i-ep-upload />
      </el-upload>
    </template>
  </el-input>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage, genFileId } from 'element-plus'
import { get as _get } from 'lodash-es'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { useUserStore } from '@/management/stores/user'

const upload = ref<UploadInstance>()

import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

interface IProps {
  formConfig: any
}

interface IEmit {
  (ev: typeof FORM_CHANGE_EVENT_KEY, arg: { key: string; value: string }): void
}

const props = defineProps<IProps>()
const emit = defineEmits<IEmit>()

const userStore = useUserStore()
const token = _get(userStore, 'userInfo.token')
const inputValue = ref(props.formConfig.value)

watch(inputValue, (newValue) => {
  emit(FORM_CHANGE_EVENT_KEY, { key: props.formConfig.key, value: newValue })
})

watch(
  () => props.formConfig.value,
  (newValue) => {
    inputValue.value = newValue
  }
)

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

function onSuccess(response: any) {
  if (response?.data?.url) {
    const key = props.formConfig.key
    emit(FORM_CHANGE_EVENT_KEY, { key, value: response.data.url })
  }
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const { limitSize } = props.formConfig
  if (limitSize) {
    if (rawFile.size / 1024 / 1024 > limitSize) {
      ElMessage.error(`图片大小不得超过 ${limitSize}MB!`)
      return false
    }
  }

  return true
}
</script>

<style lang="scss" scoped>
:deep(.el-input-group__append) {
  padding: 0;
  box-sizing: border-box;
  .upload-img {
    .el-upload {
      width: 32px;
      height: 32px;
    }
  }
}
</style>
