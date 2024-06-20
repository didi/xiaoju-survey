<template>
  <div class="question-config">
    <div class="question-config-wrapper">
      <div class="question-config-main">
        <div v-for="form of setterList" :key="form.key" class="config-item">
          <div class="config-title">
            <span>
              {{ form.title }}
            </span>
          </div>
          <el-form
            class="question-config-form"
            label-position="left"
            label-width="200px"
            @submit.prevent
          >
            <template v-for="(item, index) in form.formList">
              <FormItem
                v-if="item.type && !item.hidden && Boolean(registerTypes[item.type])"
                :key="index"
                :form-config="item"
                :style="item.style"
              >
                <Component
                  v-if="Boolean(registerTypes[item.type])"
                  :is="components[item.type]"
                  :module-config="form.dataConfig"
                  :form-config="item"
                  @form-change="handleFormChange"
                />
              </FormItem>
            </template>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, onMounted, shallowRef } from 'vue'
import { useStore } from 'vuex'
import { cloneDeep as _cloneDeep, isArray as _isArray, get as _get } from 'lodash-es'

import baseConfig from './config/baseConfig'
import baseFormConfig from './config/baseFormConfig'
import FormItem from '@/materials/setters/widgets/FormItem.vue'
import setterLoader from '@/materials/setters/setterLoader'

const formConfigList = ref<Array<any>>([])
const components = shallowRef<any>({})
const registerTypes = ref<any>({})
const setterList = computed(() => {
  const list = _cloneDeep(formConfigList.value)

  return list.map((form) => {
    const dataConfig: any = {}

    for (const formItem of form.formList) {
      const formKey = formItem.key ? formItem.key : formItem.keys
      let formValue
      if (_isArray(formKey)) {
        formValue = []
        for (const key of formKey) {
          const val = _get(store.state.edit.schema, key, formItem.value)
          formValue.push(val)
          dataConfig[key] = val
        }
      } else {
        formValue = _get(store.state.edit.schema, formKey, formItem.value)
        dataConfig[formKey] = formValue
      }
      formItem.value = formValue
    }

    form.dataConfig = dataConfig

    return form
  })
})

const store = useStore()
const handleFormChange = (data: any) => {
  store.dispatch('edit/changeSchema', {
    key: data.key,
    value: data.value
  })
}

onMounted(async () => {
  formConfigList.value = baseConfig.map((item) => ({
    ...item,
    formList: item.formList.map((key) => (baseFormConfig as any)[key]).filter((config) => !!config)
  }))

  const formList = formConfigList.value.map((item) => item.formList).flat()
  const typeList = formList.map((item) => ({
    type: item.type,
    path: item.path || item.type
  }))

  const comps = await setterLoader.loadComponents(typeList)
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
})
</script>

<style lang="scss" scoped>
.question-config {
  width: 100%;
  min-width: 1080px;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 50px 100px;

  .question-config-wrapper {
    position: relative;
    width: 50%;
    min-width: 785px;
    height: 100%;
    overflow-y: auto;

    .question-config-main {
      .config-item {
        position: relative;
        margin-bottom: 20px;
        padding: 19px 32px;
        background-color: $background-color-light;

        .config-title {
          font-size: 18px;
          color: $font-color-stress;
          text-align: left;
          padding-bottom: 19px;
          margin-bottom: 10px;
          border-bottom: 1px solid $border-color;
          padding-left: 30px;

          span {
            position: relative;

            &:after {
              position: absolute;
              left: 0;
              top: 42px;
              width: 100%;
              height: 3px;
              background-color: $primary-color;
              content: '';
            }
          }
        }

        .question-config-form {
          padding-left: 30px;
          padding-top: 15px;
          padding-right: 1rem;

          :deep(.star-form.star-form_horizon .star-form-label) {
            display: inline-block;
            width: 3.4rem;
            text-align: left;
            padding-right: 15px;
          }
        }
      }
    }
  }
}
</style>
