<template>
  <el-radio-group
    v-model="validValue"
    @change="changeData"
    class="radio-group"
    popper-class="option-list-width"
    :disabled="formConfig.disabled"
  >
    <el-radio v-for="item in options" :key="item.value" :value="item.value">
      <el-tooltip
        v-if="item.tip"
        class="item right"
        effect="dark"
        :placement="setTipPosition(item)"
      >
        <template #content>
          <div v-html="item.tip"></div>
        </template>
        <span>{{ item.label }} <i-ep-questionFilled  /></span>
      </el-tooltip>
      <template v-else-if="item.labelType === 'array'">
        <span
          class="span"
          v-for="(label, index) in item.label"
          :key="index"
          :class="[item.labelClasses && item.labelClasses[index], item.labelClass]"
          >{{ label }}</span
        >
      </template>
      <span class="span" :class="item.labelClass" v-else>{{ item.label }}</span>
    </el-radio>
  </el-radio-group>
</template>
<script>
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'
const tipPosition = {
  前置限制条件: 'top'
}

export default {
  name: 'RadioSetter',
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
    },
    setTipPosition(item) {
      return tipPosition[item.label] || 'right'
    }
  }
}
</script>
<style lang="scss" scoped>
.star-radio-wrapper {
  margin-left: 28px;
  height: 45px;

  &.no-margin {
    margin-left: 0;
  }
}

.option-list-width {
  max-width: 400px;
}

.radio-group {
  display: flex;
  flex-wrap: wrap;
}

.span {
  margin-right: 4px;
}

.span {
  white-space: pre-wrap;
  color: #6e707c !important;
}
</style>
