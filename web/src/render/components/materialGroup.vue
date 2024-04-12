<template>
  <Form ref="ruleForm" :props="{ model: formModel }" :rules="rules">
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
import questionWrapper from './QuestionRuleContainer.jsx';

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
      console.log('handleChange', data)
      this.$emit('change', data);
    },
    handleBlur() {
      this.$emit('blur');
    },
  }
});
</script>
