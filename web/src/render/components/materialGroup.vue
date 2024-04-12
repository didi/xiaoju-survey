<template>
  <Form ref="ruleForm" :model="formModel" :rules="rules">
    <questionWrapper v-for="item in renderData"
      :key="item.field"
      class="gap"
      v-bind="$attrs"
      :moduleConfig="item"
      :qIndex="item.qIndex"
      :indexNumber="item.indexNumber"
      :showTitle="true"
      @change="handleChange"
    ></questionWrapper>
  </Form>
</template>
<script>
import { defineComponent, h } from 'vue';
import Form from './form.vue';
import questionWrapper from '../../materials/questions/widgets/QuestionRuleContainer';

export default defineComponent({
  name: 'MaterialGroup',
  components: { Form, questionWrapper },
  props: {
    rules: {
      type: Object,
      default: () => {
        return {};
      },
    },
    formModel: {
      type: Object,
      default: () => {
        return {};
      },
    },
    renderData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  methods: {
    handleChange(data) {
      // 这里不能直接使用change事件，否则父元素监听change的事件，会被绑定到里面的input上
      // 导致接受到的data是个Event
      this.$emit('formChange', data);
    },
    handleBlur() {
      this.$emit('blur');
    },
  }
});
</script>
