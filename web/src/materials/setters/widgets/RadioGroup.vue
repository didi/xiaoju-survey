<template>
  <el-radio-group v-model="validValue" @change="changeData" :disabled="formConfig.disabled">
    <el-radio v-for="item in options" :key="item.value" :value="item.value" class="customed-radio">
      <el-tooltip v-if="item.tip" class="item right" effect="dark">
        <template #content>
          <div v-html="item.tip"></div>
        </template>
        <span>{{ item.label }} <i-ep-questionFilled  /></span>
      </el-tooltip>
      <div v-else v-html="item.label"></div>
    </el-radio>
  </el-radio-group>
</template>
<script>
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

export default {
  name: 'RadioGroup',
  computed: {
    options() {
      let options = []
      if (Array.isArray(this.formConfig?.options)) {
        options = this.formConfig?.options
      }
      return options.map((item) => {
        return item
      })
    }
  },
  data() {
    let value
    if (this.formConfig.value === undefined || this.formConfig.value === null) {
      value = this.formConfig.defaultValue
    } else {
      value = this.formConfig.value
    }
    return {
      validValue: value,
      noMargin: this.formConfig.noMargin,
      isActive: {}
    }
  },
  props: {
    formConfig: {
      type: Object
    }
  },
  watch: {
    formConfig: {
      handler(val) {
        this.validValue =
          val.value === undefined || val.value === null ? val.defaultValue : val.value
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    changeData(value) {
      const key = this.formConfig.key
      this.$emit(FORM_CHANGE_EVENT_KEY, {
        key,
        value
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.customed-radio {
  display: flex;
  margin-bottom: 10px;
}
</style>
