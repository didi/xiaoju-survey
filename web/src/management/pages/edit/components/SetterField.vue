<template>
  <el-form class="config-form" @submit.prevent>
    <div v-for="(item, index) in formFieldData" :key="`${item.key}${index}`" class="group-wrap">
      <div v-if="item.title" class="group-title">
        {{ item.title }}

        <el-tooltip v-if="item.tip" :content="item.tip" placement="right">
          <i-ep-questionFilled class="icon-tip" />
        </el-tooltip>
      </div>

      <template v-if="item.type === 'Customed'">
        <FormItem
          v-for="(content, contentIndex) in item.content"
          :key="`${item.key}${contentIndex}`"
          :form-config="content"
        >
          <Component
            :is="components[content.type]"
            :form-config="content"
            :module-config="moduleConfig"
            @form-change="handleFormChange($event, content)"
            :class="content.contentClass"
          />
        </FormItem>
      </template>
      <FormItem v-else :form-config="item">
        <Component
          :is="components[item.type]"
          :form-config="item"
          :module-config="moduleConfig"
          @form-change="handleFormChange($event, item)"
          :class="item.contentClass"
        />
      </FormItem>
    </div>
  </el-form>
</template>
<script setup lang="ts">
import { watch, ref, shallowRef, type Component } from 'vue'
import { get as _get, pick as _pick, isFunction as _isFunction, values as _values } from 'lodash-es'

import FormItem from '@/materials/setters/widgets/FormItem.vue'
import setterLoader from '@/materials/setters/setterLoader'

import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'

interface Props {
  formConfigList: Array<any> // 设置器的配置
  moduleConfig: any // 当前问卷schema
  customComponents?: Record<string, Component>
}

interface Emit {
  (ev: typeof FORM_CHANGE_EVENT_KEY, arg: { key: string; value: any }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

// 静态配置设置动态值
const formatValue = ({ item, moduleConfig }: any) => {
  if (_isFunction(item.valueGetter)) {
    const value = item.valueGetter({ moduleConfig })

    return value
  } else {
    const { key, keys } = item
    let result = null
    if (key) {
      result = _get(moduleConfig, key, item.value)
    }
    if (keys) {
      result = _values(_pick(moduleConfig, keys))
    }

    return result
  }
}

const formFieldData = ref<Array<any>>([])
const init = ref<boolean>(true)
const components = shallowRef<any>(props.customComponents || {})

const handleFormChange = (data: any, formConfig: any) => {
  // 处理用户操作的设置器的值
  if (_isFunction(formConfig?.valueSetter)) {
    const resultData = formConfig.valueSetter(data)

    // 批量触发设置值的变化
    if (Array.isArray(resultData)) {
      resultData.forEach((item) => {
        emit(FORM_CHANGE_EVENT_KEY, item)
      })
    } else {
      emit(FORM_CHANGE_EVENT_KEY, resultData)
    }
  } else {
    emit(FORM_CHANGE_EVENT_KEY, data)
  }
}

const normalizationValues = (configList: Array<any> = []) => {
  return configList
    .filter((item: any) => {
      // 组件组
      if (item.type === 'Customed') {
        item.content = normalizationValues(item.content)
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
        return item.relyFunc(props.moduleConfig)
      }

      return true
    })
    .map((item: any) => {
      return {
        ...item,
        value: formatValue({ item, moduleConfig: props.moduleConfig }) // 动态赋值
      }
    })
}

const registerComponents = async (formFieldData: any) => {
  let innerSetters: Array<any> = []

  const setters = formFieldData
    .filter((item: any) => !item.custom)
    .map((item: any) => {
      if (item.type === 'Customed') {
        innerSetters.push(...(item.content || []).map((content: any) => content.type))
      }

      return item.type
    })

  const settersSet = new Set([...setters, ...innerSetters])
  const settersArr = Array.from(settersSet)
  const allSetters = settersArr.map((item) => ({
    type: item,
    path: item
  }))

  try {
    const comps = await setterLoader.loadComponents(allSetters)

    for (const comp of comps) {
      if (!comp) {
        continue
      }

      const { type, component, err } = comp

      if (!err) {
        components.value[type] = component
      }
    }
  } catch (err) {
    console.error(err)
  }
}

watch(
  () => props.formConfigList, // 设置器的配置
  async (newVal: Array<any>) => {
    init.value = true

    if (!newVal || !newVal.length) {
      return
    }
    await registerComponents(newVal)
    init.value = false
    formFieldData.value = normalizationValues(newVal)
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => props.moduleConfig, // 当前问卷schema
  () => {
    // 配置变化后初次不监听value变化（如题型切换场景避免多次计算）
    if (init.value) {
      return
    }

    // TODO: 优化，依赖的schema变化时，均会重新计算
    formFieldData.value = normalizationValues(props.formConfigList)
  },
  {
    deep: true
  }
)
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
