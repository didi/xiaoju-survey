<template>
  <el-form class="config-form" @submit.prevent>
    <div v-for="(item, index) in formFieldData" :key="`${item.key}${index}`" class="group-wrap">
      <div v-if="item.title" class="group-title">
        {{ item.title }}
        
        <el-tooltip
          v-if="item.tip"
          :content="item.tip"
          placement="right"
        >
          <i-ep-questionFilled class="icon-tip" />
        </el-tooltip>
      </div>

      <template v-if="item.type === 'Customed'">
        <FormItem        v-for="(content, contentIndex) in item.content"
          :key="`${item.key}${contentIndex}`"
          :form-config="content"
        >
          <Component
            :is="content.type"
            :form-config="content"
            :module-config="moduleConfig"
            @form-change="onFormChange($event, content)"
            :class="content.contentClass"
          />
        </FormItem>
      </template>
      <FormItem v-else :form-config="item">
        <Component
          :is="item.type"
          :form-config="item"
          :module-config="moduleConfig"
          @form-change="onFormChange($event, item)"
          :class="item.contentClass"
        />
      </FormItem>
    </div>
  </el-form>
</template>

<script>
import { get as _get, pick as _pick, isFunction as _isFunction } from 'lodash-es'

import FormItem from '@/materials/setters/widgets/FormItem.vue'
import setterLoader from '@/materials/setters/setterLoader'

import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

// 静态配置设置动态值
const formatValue = ({ item, moduleConfig }) => {
  if (_isFunction(item.valueAdapter)) {
    const value = item.valueAdapter({ moduleConfig })

    return value
  } else {
    const { key, keys } = item
    let result = null
    if (key) {
      result = _get(moduleConfig, key, item.value)
    }
    if (keys) {
      result = _pick(moduleConfig, keys)
    }

    return result
  }
}

export default {
  name: 'SettersField',
  props: {
    formConfigList: Array, // 对应题型组件的meta.js内容
    moduleConfig: Object,
  },
  data() {
    return {
      register: {},
      formFieldData: [],
      init: true
    }
  },
  components: {
    FormItem
  },
  watch: {
    formConfigList: {
      deep: true,
      immediate: true,
      async handler (newVal) {        
        this.init = true
        if (!newVal || !newVal.length) {
          return
        }

        // 组件注册
        await this.handleComponentRegister(newVal)
        
        this.init = false
        this.formFieldData = this.setValues(this.formConfigList)
      }
    },
    // schema变化联动
    moduleConfig: {
      deep: true,
      async handler () {
        // 配置变化后初次不监听value变化（如题型切换场景避免多次计算）
        if (this.init) {
          return       
        }

        // TODO: 优化，依赖的schema变化时，均会重新计算
        this.formFieldData = this.setValues(this.formConfigList)
      }
    }
  },
  methods: {
    setValues(configList = []) {
      return configList.filter((item) => {
          // 组件组
          if (item.type === 'Customed') {
            item.content = this.setValues(item.content)
            return true
          }

          if (!item.type) {
            return false
          }
          if (item.hidden) {
            return false
          }

          // 动态显隐设置器
          if (_isFunction(item.relyFunc)) {
            return item.relyFunc(this.moduleConfig)
          }

          return true
        }).map((item) => {
          return {
            ...item,
            value: formatValue({ item, moduleConfig: this.moduleConfig }) // 动态复值
          }
        })
    },
    async handleComponentRegister(formFieldData) {
      let innerSetters = []
      const setters = formFieldData.map((item) => {
        if (item.type === 'Customed') {
          innerSetters.push(...(item.content || []).map(content => content.type))
        }

        return item.type
      })

      const settersSet = new Set([...setters, ...innerSetters])
      const settersArr = Array.from(settersSet)
      const allSetters = settersArr.map((item) => {
        return {
          type: item,
          path: item
        }
      })
      try {
        const comps = await setterLoader.loadComponents(allSetters)
        for (const comp of comps) {
          if (!comp) {
            continue
          }
          const { type, component, err } = comp
          if (!err) {
            const componentName = component.name
            if (!this.$options.components) {
              this.$options.components = {}
            }
            this.$options.components[componentName] = component
            this.register[type] = componentName
          }
        }
      } catch (err) {
        console.error(err)
      }
    },

    onFormChange(data, formConfig) {
      if (_isFunction(formConfig?.setterAdapter)) {
        const resultData = formConfig.setterAdapter(data)
        if (Array.isArray(resultData)) {
          resultData.forEach((item) => {
            this.$emit(FORM_CHANGE_EVENT_KEY, item)
          })
        } else {
          this.$emit(FORM_CHANGE_EVENT_KEY, resultData)
        }
      } else {
        this.$emit(FORM_CHANGE_EVENT_KEY, data)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.config-form {
  padding: 15px 0;

  .group-wrap {
    margin-bottom: 20px;
  }

  .group-title {
    font-size: 14px;
    color: #606266;
    margin-bottom: 20px;
    font-weight: bold;
    align-items: center;
    display: flex;

    .icon-tip {
      font-size: 13px;
      color: #606266;
    }
  }
}
</style>
