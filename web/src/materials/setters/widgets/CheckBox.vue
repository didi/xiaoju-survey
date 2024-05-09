<template>
  <el-checkbox
    v-model="validValue"
    @change="changeData"
    :disabled="checkBoxDis"
    :class="{ inline: !!formConfig?.inline }"
  >
  </el-checkbox>
</template>
<script>
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'
export default {
  name: 'CheckBox',
  data() {
    return {
      validValue: this.formConfig.value
    }
  },
  props: {
    formConfig: {
      type: Object,
      required: true
    },
    moduleConfig: {
      type: Object,
      required: true
    }
  },
  computed: {
    checkBoxDis() {
      return (
        this.formConfig.key === 'randomSort' &&
        this.moduleConfig?.optionOrigin?.length > 0 &&
        this.moduleConfig?.extraOptions &&
        this.moduleConfig?.extraOptions.length === 0
      )
    },
    optionOrigin() {
      return this.moduleConfig.optionOrigin
    },
    extraOptionsLength() {
      return this.moduleConfig?.extraOptions?.length || []
    }
  },
  watch: {
    optionOrigin(newVal) {
      if (
        this.formConfig.key === 'randomSort' &&
        newVal &&
        this.moduleConfig?.extraOptions.length === 0
      ) {
        this.$emit(FORM_CHANGE_EVENT_KEY, {
          key: 'randomSort',
          value: false
        })
        this.validValue = false
      }
    },
    extraOptionsLength(newVal) {
      if (this.formConfig.key === 'randomSort' && this.moduleConfig?.optionOrigin && newVal === 0) {
        this.$emit(FORM_CHANGE_EVENT_KEY, {
          key: 'randomSort',
          value: false
        })
        this.validValue = false
      }
    },
    'formConfig.value': {
      immediate: true,
      handler(newVal) {
        if (newVal === this.validValue) {
          return
        }
        this.validValue = !!newVal
      }
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
.inline {
  width: 140px;
}
</style>
