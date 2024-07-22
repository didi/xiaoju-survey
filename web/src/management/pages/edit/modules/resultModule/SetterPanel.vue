<template>
  <div class="question-edit-form">
    <div class="setter-title">
      {{ currentEditText }}
    </div>
    <el-form class="question-config-form" label-position="top" @submit.prevent>
      <template v-for="(item, index) in formFields" :key="index">
        <FormItem
          v-if="item.type && !item.hidden && Boolean(registerTypes[item.type])"
          :form-config="item"
          :style="item.style"
        >
          <Component
            v-if="Boolean(registerTypes[item.type])"
            :is="components[item.type]"
            :module-config="moduleConfig"
            :form-config="item"
            @form-change="handleFormChange"
          />
        </FormItem>
      </template>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, shallowRef, toRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useEditStore } from '@/management/stores/edit'
import { get as _get } from 'lodash-es'

import FormItem from '@/materials/setters/widgets/FormItem.vue'
import setterLoader from '@/materials/setters/setterLoader'
import statusConfig from '@/management/pages/edit/setterConfig/statusConfig'

const textMap = {
  Success: '提交成功页面配置',
  OverTime: '问卷过期页面配置'
}

const editStore = useEditStore()
const { currentEditStatus } = storeToRefs(editStore)
const { schema, changeSchema } = editStore

const components = shallowRef<any>({})
const registerTypes = ref<any>({})
const moduleConfig = toRef(schema, 'submitConf')
const currentEditText = computed(() => (textMap as any)[currentEditStatus.value])
const formFields = computed(() => {
  const formList = (statusConfig as any)[currentEditStatus.value] || []
  const list = formList.map((item: any) => {
    const value = _get(moduleConfig.value, item.key, item.value)

    return { ...item, value }
  })

  registerComponents(list)

  return list
})

const handleFormChange = ({ key, value }: any) => {
  changeSchema({
    key: `submitConf.${key}`,
    value
  })
}

const registerComponents = async (formFieldData: any) => {
  const setters = formFieldData.map((item: any) => item.type)
  const settersSet = new Set(setters)
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

        components.value[type] = component
        registerTypes.value[type] = componentName
      }
    }
  } catch (err) {
    console.error(err)
  }
}
</script>
<style lang="scss" scoped>
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
