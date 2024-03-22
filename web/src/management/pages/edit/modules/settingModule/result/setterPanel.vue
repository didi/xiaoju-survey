<template>
  <div class="question-edit-form">
    <div class="setter-title">
      {{ currentEditText }}
    </div>
    <el-form
      class="question-config-form"
      size="small"
      label-position="top"
      @submit.native.prevent
    >
      <template v-for="(item, index) in formFieldData">
        <FormItem
          :key="index"
          v-if="item.type && !item.hidden && Boolean(registerd[item.type])"
          :form-config="item"
          :style="item.style"
        >
          <Component
            v-if="Boolean(registerd[item.type])"
            :is="item.type"
            :module-config="moduleConfig"
            :form-config="item"
            @form-change="onFormChange"
          />
        </FormItem>
      </template>
    </el-form>
  </div>
</template>
<script>
import FormItem from '@/materials/setters/widgets/FormItem.vue';
import setterLoader from '@/materials/setters/setterLoader';
import statusConfig from '../config/statusConfig';
import { mapState } from 'vuex';
import { get as _get, pick as _pick } from 'lodash-es';

const textMap = {
  Success: '提交成功页面配置',
  OverTime: '问卷过期页面配置',
};

export default {
  name: 'StatusEditForm',
  components: {
    FormItem,
  },
  data() {
    return {
      registerd: {},
    };
  },
  computed: {
    formFieldData() {
      const formList = statusConfig[this.currentEditStatus] || [];
      return formList.map((item) => {
        const value = _get(this.moduleConfig, item.key, item.value);
        return {
          ...item,
          value,
        };
      });
    },
    currentEditText() {
      return textMap[this.currentEditStatus] || '';
    },
    ...mapState({
      currentEditStatus: (state) => state.edit.currentEditStatus,
      submitConf: (state) => _get(state, 'edit.schema.submitConf'),
    }),
    moduleConfig() {
      return this.submitConf;
    },
  },
  watch: {
    formFieldData: {
      immediate: true,
      handler(newVal) {
        if (Array.isArray(newVal)) {
          this.handleComponentRegister(newVal);
        }
      },
    },
  },
  methods: {
    async handleComponentRegister(formFieldData) {
      const setters = formFieldData.map((item) => item.type);
      const settersSet = new Set(setters);
      const settersArr = Array.from(settersSet);
      const allSetters = settersArr.map((item) => {
        return {
          type: item,
          path: item,
        };
      });
      try {
        const comps = await setterLoader.loadComponents(allSetters);
        for (const comp of comps) {
          if (!comp) {
            continue;
          }
          const { type, component, err } = comp;
          if (!err) {
            const componentName = component.name;
            this.$options.components[componentName] = component;
            this.$set(this.registerd, type, componentName);
          }
        }
      } catch (err) {
        console.error(err);
      }
    },
    getValueFromModuleConfig(item) {
      const { key, keys } = item;
      const moduleConfig = this.moduleConfig;
      let result = item;
      if (key) {
        result = {
          ...item,
          value: _get(moduleConfig, key, item.value),
        };
      }
      if (keys) {
        result = {
          ...item,
          value: _pick(moduleConfig, keys),
        };
      }
      return result;
    },
    onFormChange(data) {
      const { key, value } = data;
      const resultKey = `submitConf.${key}`;
      this.$store.dispatch('edit/changeSchema', { key: resultKey, value });
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.question-edit-form {
  width: 360px;
  height: 100%;
  overflow-y: auto;
  background-color: #ffffff;
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

.question-config-form {
  padding: 30px 20px 50px 20px;
}
</style>
