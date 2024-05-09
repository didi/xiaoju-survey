<template>
  <div>
    <el-row class="row">
      <el-select :modelValue="backfillSelect" @change="onSelectChange">
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
        :value="hourSwitch"
        @change="onSwitchChange"
      ></el-switch>
    </el-row>
  </div>
</template>
<script>
import { cleanRichText } from '@/common/xss'
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'
const formdataBackfillKey = 'baseConf.formdataBackfill'
const formdataBackfillHourKey = 'baseConf.formdataBackfillHour'

export default {
  name: 'FormDataBackFill',
  data() {
    return {
      backfillSelect: this.formConfig.value[formdataBackfillKey],
      hourSwitch: !!this.formConfig.value[formdataBackfillHourKey]
    }
  },
  props: {
    formConfig: {
      type: Object,
      required: true
    }
  },
  watch: {
    'formConfig.value': {
      deep: true,
      handler(newVal) {
        const formdataBackfill = newVal[formdataBackfillKey]
        const formdataBackfillHour = !!newVal[formdataBackfillHourKey]
        if (formdataBackfill !== this.backfillSelect) {
          this.backfillSelect = formdataBackfill
        }
        if (formdataBackfillHour !== this.hourSwitch) {
          this.hourSwitch = formdataBackfillHour
        }
      }
    }
  },
  computed: {
    showFormdataBackfillHour() {
      if (this.backfillSelect === 'notallow') {
        return false
      }
      return true
    },
    options() {
      let options = []
      if (Array.isArray(this.formConfig?.options)) {
        options = this.formConfig?.options
      }
      return options.map((item) => {
        item.label = cleanRichText(item.label)
        return item
      })
    }
  },
  methods: {
    onSelectChange(newVal) {
      this.changeData({ key: formdataBackfillKey, value: newVal })
    },
    onSwitchChange(newVal) {
      this.changeData({
        key: formdataBackfillHourKey,
        value: newVal ? 24 : null
      })
    },
    changeData({ key, value }) {
      this.$emit(FORM_CHANGE_EVENT_KEY, {
        key,
        value
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.row {
  margin-bottom: 20px;
}
</style>
