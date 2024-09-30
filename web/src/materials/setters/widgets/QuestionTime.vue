<template>
  <div class="custom-time-range">
    <el-config-provider :locale="locale">
      <el-date-picker
        v-model="begModelTime"
        type="datetime"
        placeholder="开始日期"
        format="YYYY-MM-DD HH:mm:ss"
        @change="handleDatePickerChange(formConfig.keys[0], $event)"
      />
      <span class="seporator">至</span>
      <el-date-picker
        v-model="endModelTime"
        type="datetime"
        placeholder="结束日期"
        format="YYYY-MM-DD HH:mm:ss"
        @change="handleDatePickerChange(formConfig.keys[1], $event)"
      />
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

const format = 'yyyy-MM-DD HH:mm:ss'
const defaultBeginTime = new Date()
const defaultEndTime = moment(defaultBeginTime).add(10, 'year').toDate()

const locale = ref(zhCn)
const begModelTime = ref(defaultBeginTime)
const endModelTime = ref(defaultEndTime)
const beginTimeStr = ref(moment(defaultBeginTime).format(format))
const endTimeStr = ref(moment(defaultEndTime).format(format))

const handleDatePickerChange = (key: string, value: string) => {
  emit(FORM_CHANGE_EVENT_KEY, { key, value })
}

watch(
  () => props.formConfig.value,
  ([beginTime, endTime]: any) => {
    if (!!beginTime && beginTime !== beginTimeStr.value) {
      beginTimeStr.value = beginTime
      begModelTime.value = new Date(beginTime)
    }

    if (!!endTime && endTime !== endTimeStr.value) {
      endTimeStr.value = endTime
      endModelTime.value = new Date(endTime)
    }
  },
  {
    immediate: true,
    deep: true
  }
)
</script>
<style lang="scss" scoped>
.custom-time-range {
  width: 100%;
  display: flex;
  justify-content: space-between;

  .seporator {
    margin: 0 10px;
  }
}
</style>
