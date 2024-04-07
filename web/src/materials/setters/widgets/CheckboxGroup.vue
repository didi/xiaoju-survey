<template>
  <div class="checkbox-group">
    <div
      class="customed-checkbox"
      v-for="item in this.formConfig.options"
      :key="item.key"
    >
      <el-checkbox
        v-model="values[item.key]"
        :label="item.label"
        @change="onChange(item.key, $event)"
      >
      </el-checkbox>
      <el-tooltip
        v-if="item.tip"
        class="tooltip"
        effect="dark"
        placement="right"
      >
        <template #content>
          <div v-plain-text="item.tip"></div>
        </template>
        <i class="el-icon-question icon-tip"></i>
      </el-tooltip>
    </div>
  </div>
</template>
<script>
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant';
export default {
  name: 'CheckboxGroup',
  props: {
    formConfig: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      values: this.formConfig.value,
    };
  },
  watch: {
    'formConfig.value': {
      immediate: true,
      deep: true,
      handler(newVal) {
        const keys = Object.keys(newVal);
        for (const key of keys) {
          if (newVal[key] !== this.values[key]) {
            this.values[key] = newVal[key];
          }
        }
      },
    },
  },
  methods: {
    onChange(key, value) {
      this.$emit(FORM_CHANGE_EVENT_KEY, {
        key,
        value,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.customed-checkbox {
  display: inline-block;
  width: 140px;
}

.icon-tip {
  color: #606266;
}
</style>
