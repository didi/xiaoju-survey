<template>
  <div class="star-question-multiline">
    <el-form-item v-for="item in formConfig.content" :key="item.key">
      <label class="multiline-label">
        {{ item.label }}
        <el-tooltip
          v-if="item.tip"
          class="item"
          effect="dark"
          :content="item.tip"
          placement="top"
        >
          <i class="el-icon-question"></i>
        </el-tooltip>
      </label>
      <el-input
        :value="formConfig.value[item.key]"
        @change="(val) => changeData(item.key, val)"
        @input="(val) => changeData(item.key, val)"
        :placeholder="item.placeholder"
      />
    </el-form-item>
  </div>
</template>
<script>
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant';
export default {
  name: 'MultiInput',
  props: {
    formConfig: {
      type: Object,
      required: true,
    },
    moduleConfig: {
      type: Object,
      required: true,
    },
  },
  methods: {
    changeData(key, value) {
      if (this.formConfig.key) {
        this.$emit(FORM_CHANGE_EVENT_KEY, {
          key: this.formConfig.key + '.' + key,
          value,
        });
      } else if (this.formConfig.keys) {
        this.$emit(FORM_CHANGE_EVENT_KEY, {
          key,
          value,
        });
      } else {
        // todo
      }
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.star-question-multiline {
  .el-form-item__content {
    display: flex;
  }

  .multiline-label {
    display: inline-block;
    color: #666;

    & + .el-input {
      flex: 1;
      margin-left: 20px;
      margin-bottom: 12px;
    }
  }
}
</style>
