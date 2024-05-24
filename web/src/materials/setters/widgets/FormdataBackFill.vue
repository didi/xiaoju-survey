<template>
  <div>
    <el-row class="row">
      <el-select :modelValue="selectModelValue" @change="handleSelectChange">
        <el-option
          v-for="item in options"
          :label="`${item.label}`"
          :value="item.value"
          :key="item.value"
        />
      </el-select>
    </el-row>
    <el-row v-show="showFormdataBackfillHour">
      <el-switch
        :inactive-text="formConfig.labels['baseConf.formdataBackfillHour']"
        :value="switchModelValue"
        @change="handleSwitchChange"
      ></el-switch>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { cleanRichText } from '@/common/xss'
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

const formdataBackfillKey = 'baseConf.formdataBackfill'
const formdataBackfillHourKey = 'baseConf.formdataBackfillHour'

interface Props {
  formConfig: any
}

interface Emit {
  (ev: typeof FORM_CHANGE_EVENT_KEY, arg: { key: string; value: string | null }): void
}

const emit = defineEmits<Emit>()
const props = defineProps<Props>()

const selectModelValue = ref(props.formConfig.value[formdataBackfillKey])
const switchModelValue = ref(props.formConfig.value[formdataBackfillHourKey])
const showFormdataBackfillHour = computed(() =>
  selectModelValue.value !== 'notallow' ? true : false
)
const options = computed(() => {
  if (!Array.isArray(props.formConfig?.options)) {
    return []
  }

  return props.formConfig?.options.map((item: any) => {
    item.label = cleanRichText(item.label)
    return item
  })
})

const handleSelectChange = (value: string) => {
  emit(FORM_CHANGE_EVENT_KEY, { key: formdataBackfillKey, value })
}

const handleSwitchChange = (value: string | null) => {
  emit(FORM_CHANGE_EVENT_KEY, { key: formdataBackfillHourKey, value: value ? '24' : null })
}

const watchValue = computed(() => props.formConfig.value)
watch(watchValue, (config) => {
  const formdataBackfill = config[formdataBackfillKey]
  const formdataBackfillHour = !!config[formdataBackfillHourKey]

  if (formdataBackfill !== selectModelValue.value) {
    selectModelValue.value = formdataBackfill
  }

  if (formdataBackfillHour !== switchModelValue.value) {
    switchModelValue.value = formdataBackfillHour
  }
})
</script>
<style lang="scss" scoped>
.row {
  margin-bottom: 20px;
}
</style>
