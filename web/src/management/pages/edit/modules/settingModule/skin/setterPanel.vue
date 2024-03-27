<template>
  <div class="setter-wrapper">
    <div class="setter-title">
      样式设置
    </div>
    <div class="setter-content">
      <el-collapse v-model="collapse">
        <el-collapse-item
          v-for="(collapse, index) in skinConfig"
          :key="index"
          :title="collapse.name"
          :name="collapse.key"
        >
          <setterField
            :form-config-list="collapse.formConfigList"
            :module-config="_get(schema, collapse.key, {})"
            @form-change="(key) => { onFormChange(key, collapse.key) }"
          /> 
        </el-collapse-item>
      </el-collapse>
    </div>
     <!-- -->
  </div>
</template>
<script>
import skinConfig from '@/management/config/setterConfig/skinConfig';
import setterField from '@/management/pages/edit/components/setterField.vue';
import { mapState, mapGetters } from 'vuex';
import { get as _get } from 'lodash-es'
export default {
  name: 'setterPanel',
  components: {
    setterField,
  },
  data() {
    return {
      collapse: '',
      skinConfig,
    };
  },
  computed: {
    ...mapState({
      skinConf: (state) => _get(state, 'edit.schema.skinConf'),
      schema: (state) => _get(state, 'edit.schema'),
    }),
  },
  methods: {
    _get,
    onFormChange(data,collapse) {
      const { key, value } = data;
      const currentEditKey = `${collapse}`
      const resultKey = `${currentEditKey}.${key}`;
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
  // background: #f9fafc;
  border-bottom: 1px solid #edeffc;
}
.setter-content{
  padding: 10px 20px;
  .el-collapse {
    border: none;
    ::v-deep .el-collapse-item__header{
      font-size: 14px;
      color: #606266;
      font-weight: bold;
      border: none;
    }
    ::v-deep .el-collapse-item__wrap{
      border: none;
      .el-collapse-item__content{
        padding-bottom: 0px!important;
      }

    }
  }
  .config-form{
    padding: 0!important;
  }
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
  padding: 30px 20px 50px 20px;
}
</style>
