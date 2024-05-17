<template>
  <div class="star-question-multiline">
    <el-form-item v-for="item in formConfig.content" :key="item.key">
      <label class="multiline-label">
        {{ item.label }}
        <el-tooltip v-if="item.tip" class="item" effect="dark" :content="item.tip" placement="top">
          <i-ep-questionFilled />
        </el-tooltip>
      </label>
      <el-input
        :value="formConfig.value[item.key]"
        @onchge="handleInputChange(item.key, $event)"
        :placeholder="item.placeholder"
      />
    </el-form-item>
  </div>
</template>
<script setup lang="ts">
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

interface Props {
  formConfig: any
  moduleConfig: any
}

interface Emit {
  (ev: typeof FORM_CHANGE_EVENT_KEY, arg: { key: string; value: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const handleInputChange = (itemKey: string, value: string) => {
  const key = props.formConfig.key

  emit(FORM_CHANGE_EVENT_KEY, { key: `${key}.${itemKey}`, value })
}
</script>
<style lang="scss" scoped>
.star-question-multiline {
  .el-form-item__content {
    display: flex;
  }

  .multiline-label {
    display: inline-block;
    color: #666;

    & + .el-input {
      flex: 1;
      margin-left: 20px;
      margin-bottom: 12px;
    }
  }
}
</style>
