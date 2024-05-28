<template>
  <div class="checkbox-group">
    <div class="customed-checkbox" v-for="item in formConfig.options" :key="item.key">
      <el-checkbox
        v-model="optionsValue[item.key]"
        :label="item.label"
        @change="handleCheckboxChange(item.key, $event)"
      >
      </el-checkbox>
      <el-tooltip v-if="item.tip" class="tooltip" effect="dark" placement="right">
        <template #content>
          <div v-plain-text="item.tip"></div>
        </template>
        <i-ep-questionFilled v-if="item.tip" class="icon-tip" />
      </el-tooltip>
    </div>
  </div>
</template>
<script setup lang="ts">
import { watch, reactive } from 'vue'
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

interface Props {
  formConfig: any
}

interface Emit {
  (ev: typeof FORM_CHANGE_EVENT_KEY, arg: { key: string; value: boolean }): void
}

const props = withDefaults(defineProps<Props>(), {
  formConfig: {}
})

const emit = defineEmits<Emit>()

const handleCheckboxChange = (key: string, value: boolean) => {
  emit(FORM_CHANGE_EVENT_KEY, { key, value })
}

const optionsValue = reactive<any>(props.formConfig?.value)

watch(
  () => props.formConfig?.value,
  (val) => {
    const keys = Object.keys(val)

    for (const key of keys) {
      if (val[key] !== optionsValue[key]) {
        optionsValue[key] = val[key]
      }
    }
  },
  { immediate: true, deep: true }
)
</script>
<style lang="scss" scoped>
.customed-checkbox {
  display: inline-block;
  width: 140px;
}

.icon-tip {
  font-size: 13px;
  color: #606266;
}
</style>
