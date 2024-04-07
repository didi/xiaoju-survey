<template>
  <el-form
    class="config-form"
    size="small"
    :labelPosition="labelPosition"
    label-width="110px"
    :inline="inline"
    @submit.native.prevent
  >
    <template v-for="(item, index) in formFieldData">
      <FormItem :key="item.key + index" class="form-item" :form-config="item">
        <template v-if="item.type === 'Customed'">
          <SettersField
            :key="index"
            :form-config-list="item.content"
            :module-config="moduleConfig"
            @form-change="onFormChange($event, item)"
            :inline="true"
            labelPosition="left"
            :class="item.contentClass"
          ></SettersField>
        </template>
        <Component
          v-else
          :is="item.type"
          :module-config="moduleConfig"
          :form-config="item"
          @form-change="onFormChange($event, item)"
          :slot="item.contentPosition || null"
        />
      </FormItem>
    </template>
  </el-form>
</template>
<script>
import {
  get as _get,
  pick as _pick,
  isFunction as _isFunction,
} from 'lodash-es';

import FormItem from '@/materials/setters/widgets/FormItem.vue';
import setterLoader from '@/materials/setters/setterLoader';

import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant';

const formatValue = ({ item, moduleConfig }) => {
  if (_isFunction(item.valueAdapter)) {
    const value = item.valueAdapter({ moduleConfig });
    return value;
  } else {
    const { key, keys } = item;

    let result = null;
    if (key) {
      result = _get(moduleConfig, key, item.value);
    }
    if (keys) {
      result = _pick(moduleConfig, keys);
    }
    return result;
  }
};

export default {
  name: 'SettersField',
  props: {
    formConfigList: Array,
    moduleConfig: Object,
    inline: {
      type: Boolean,
      default: false,
    },
    labelPosition: {
      type: String,
      default: 'top',
    },
  },
  data() {
    return {
      registerd: {},
    };
  },
  components: {
    FormItem,
  },
  computed: {
    formFieldData() {
      return this.formConfigList
        .filter((item) => {
          if (!item.type) {
            return false;
          }
          if (item.type !== 'Customed' && !this.registerd[item.type]) {
            return false;
          }
          if (item.hidden) {
            return false;
          }
          if (_isFunction(item.relyFunc)) {
            return item.relyFunc(this.moduleConfig);
          }
          return true;
        })
        .map((item) => {
          return {
            ...item,
            value: formatValue({ item, moduleConfig: this.moduleConfig }),
          };
        });
    },
  },
  watch: {
    formConfigList: {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (!newVal || !newVal.length) {
          return;
        }
        this.handleComponentRegister(newVal);
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
            if (!this.$options.components) {
              this.$options.components = {};
            }
            this.$options.components[componentName] = component;
            this.$set(this.registerd, type, componentName);
          }
        }
      } catch (err) {
        console.error(err);
      }
    },

    onFormChange(data, formConfig) {
      if (_isFunction(formConfig?.setterAdapter)) {
        const resultData = formConfig.setterAdapter(data);
        if (Array.isArray(resultData)) {
          resultData.forEach((item) => {
            this.$emit(FORM_CHANGE_EVENT_KEY, item);
          });
        } else {
          this.$emit(FORM_CHANGE_EVENT_KEY, resultData);
        }
      } else {
        this.$emit(FORM_CHANGE_EVENT_KEY, data);
      }
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.config-form {
  padding: 15px 0;
}
.nps-customed-config {
  .el-form-item {
    margin-right: 0px;
    ::v-deep .el-form-item__label {
      width: 70px !important;
      margin-right: 8px;
    }
    ::v-deep .el-input__inner {
      width: 234px;
    }
  }
}
</style>
