<template>
  <div class="time-hour">
    <el-config-provider :locale="locale">
      <el-time-picker
        is-range
        v-model="modelValue"
        range-separator="-"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        placeholder="选择时间范围"
        format="HH:mm:ss"
        @change="handleTimePickerChange"
        popper-class="timeRange"
      >
      </el-time-picker>
    </el-config-provider>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import moment from 'moment'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

interface Props {
  formConfig: any
}

interface Emit {
  (ev: typeof FORM_CHANGE_EVENT_KEY, arg: { key: string; value: string }): void
}

const emit = defineEmits<Emit>()
const props = defineProps<Props>()

const locale = ref(zhCn)
const modelValue = ref<any>([])
const timeValue = ref<any>([])

const handleTimePickerChange = (values: Array<string>) => {
  if (!values) {
    return
  }

  const keys = props.formConfig.keys
  const times = values.map((item) => moment(item).format('HH:mm:ss'))

  timeValue.value = times
  times.forEach((value, idx) => emit(FORM_CHANGE_EVENT_KEY, { key: keys[idx], value }))
}

watch(
  () => props.formConfig.value,
  ([startTime = '00:00:00', endTime = '23:59:59']: Array<string>) => {
    if (startTime !== timeValue.value[0] || endTime !== timeValue.value[1]) {
      const times = [startTime, endTime]
      const currentDate = moment(Date.now()).format('yyyy-MM-DD')

      modelValue.value = times.map((time) => `${currentDate} ${time}`)
      timeValue.value = times
    }
  },
  {
    immediate: true,
    deep: true
  }
)
</script>
<style lang="scss" scoped>
.star-question-begAndEndHour {
  display: flex;

  .el-form-item {
    flex: 1;

    .el-date-editor {
      width: 100%;
    }
  }

  .split {
    width: 40px;
    position: relative;

    &::before {
      content: '';
      display: block;
      width: 16px;
      height: 2px;
      background-color: #999;
      position: absolute;
      left: 50%;
      margin-left: -8px;
      top: 50%;
      margin-top: -1px;
    }
  }
}

.timeRange {
  .el-time-panel__btn.confirm {
    color: $primary-color;
  }
}

.time-hour {
  width: 100%;
  :deep(.el-date-editor) {
    width: 100%;
  }
}
</style>
