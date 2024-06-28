<template>
  <div class="switch-input-wrap">
    <el-switch v-model="passwordSwitch" @change="changeData(props.formConfig.keys[0],passwordSwitch)"  />
    <InputWordLimit
      v-if="passwordSwitch"
      class="mt16"
      @form-change="handleFormChange"
      :formConfig="{
        ...props.formConfig,
        key: props.formConfig.keys[1],
        value:props.formConfig?.value[1]
      }"
    />
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'
import InputWordLimit from './InputWordLimit.vue'

const store = useStore();
const props = defineProps({
  formConfig: Object,
})
const emit = defineEmits([FORM_CHANGE_EVENT_KEY])
const passwordSwitch = ref(props.formConfig?.value[0] || false);


const changeData = (key, value) => {
  emit(FORM_CHANGE_EVENT_KEY, {
    key,
    value
  })

}
const handleFormChange = (data) => {
  store.dispatch('edit/changeSchema', {
    key: data.key,
    value: data.value
  })
}

</script>
<style lang="scss" scoped>
.switch-input-wrap{
  width: 100%;
  .mt16{
    margin-top: 16px;
  }
}
</style>