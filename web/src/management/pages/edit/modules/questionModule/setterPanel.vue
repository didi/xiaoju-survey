<template>
  <div class="setter-wrapper">
    <div class="no-select-question" v-if="currentEditOne === null">
      <img src="/imgs/icons/unselected.webp" />
      <h4 class="tipFont">选中题型可以编辑</h4>
      <span class="tip">来！试试看～</span>
    </div>
    <template v-else>
      <div class="setter-title">{{ currentEditMeta?.title || '' }}</div>
      <setterField
        class="question-config-form"
        :form-config-list="formConfigList"
        :module-config="moduleConfig"
        @form-change="onFormChange"
      />
    </template>
  </div>
</template>

<script>
import setterField from '@/management/pages/edit/components/setterField.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'setterWrapper',
  data() {
    return {
      tabSelected: '0',
    };
  },
  computed: {
    currentEditOne() {
      return this.$store.state?.edit?.currentEditOne;
    },
    ...mapGetters({
      formConfigList: 'edit/formConfigList',
      moduleConfig: 'edit/moduleConfig',
      currentEditKey: 'edit/currentEditKey',
      currentEditMeta: 'edit/currentEditMeta',
    }),
  },
  components: {
    setterField,
  },
  methods: {
    onFormChange(data) {
      const { key, value } = data;
      const resultKey = `${this.currentEditKey}.${key}`;
      this.$store.dispatch('edit/changeSchema', { key: resultKey, value });
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.setter-wrapper {
  width: 360px;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #fff;
}

.setter-title {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  color: $primary-color;
  padding-left: 20px;
  border-bottom: 1px solid #edeffc;
}

.no-select-question {
  padding-top: 125px;
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    width: 160px;
    padding: 25px;
  }

  .tip {
    font-size: 14px;
    color: $normal-color;
    letter-spacing: 0;
  }
}

.question-config-form {
  padding: 30px 20px 50px 20px!important;
}
</style>
