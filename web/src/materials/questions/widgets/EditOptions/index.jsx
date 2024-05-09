import { defineComponent, ref, computed, onMounted } from 'vue'

import store from '@/management/store'

import OptionEdit from './Options/OptionEdit.vue'
import OptionEditBar from './Options/OptionEditBar.vue'
import UseOptionBase from './Options/UseOptionBase'

export default defineComponent({
  name: 'EditOptions',
  provide() {
    return {
      currentEditKey: store.getters['edit/currentEditKey'],
      moduleConfig: computed(() => this.moduleConfig)
    }
  },
  props: {
    editConfigure: {
      type: Object,
      required: true
    },
    moduleConfig: {
      type: Object,
      required: true
    }
  },
  setup(props, { slots }) {
    const currentEditKey = computed(() => {
      return store.getters['edit/currentEditKey']
    })
    const getOptions = computed(() => {
      return props.moduleConfig.options
    })
    const { addOption, addOtherOption } = UseOptionBase(getOptions)
    const handleAddOption = (text = '选项', others = false, index = -1, field) => {
      const value = addOption(text, others, index, field)
      handleOptionChange(value)
    }
    const handleAddOtherOption = () => {
      const { field } = props.moduleConfig
      const value = addOtherOption(field)
      handleOptionChange(value)
    }

    const handleOptionChange = (value) => {
      const optionKey = `options`
      const key = `${currentEditKey.value}.${optionKey}`
      handleChange({ key, value })
    }

    const handleChange = ({ key, value }) => {
      store.dispatch('edit/changeSchema', { key, value })
    }

    const hasAdvancedConfig = ref(false)
    const hasAdvancedRateConfig = ref(false)
    const showOthers = ref(false)
    const showOptionEdit = ref(true)
    const showOptionEditBar = ref(true)
    onMounted(() => {
      const { optionEdit, optionEditBar } = props.editConfigure
      showOptionEdit.value = optionEdit.show
      showOptionEditBar.value = optionEditBar.show
      showOthers.value = optionEditBar.configure.showOthers
      hasAdvancedConfig.value = Boolean(optionEditBar.configure.showAdvancedConfig)
      hasAdvancedRateConfig.value = Boolean(optionEditBar.configure.showAdvancedRateConfig)
    })
    return {
      slots,
      getOptions,
      hasAdvancedConfig,
      hasAdvancedRateConfig,
      showOptionEdit,
      showOptionEditBar,
      showOthers,
      handleAddOption,
      handleAddOtherOption,
      handleOptionChange,
      handleChange
    }
  },
  render() {
    const { slots } = this
    return (
      <div class="selected-wrapper radio-selected-wrapper">
        {this.showOptionEdit ? (
          <OptionEdit
            option-list={this.getOptions}
            onAddOption={this.handleAddOption}
            onOptionChange={this.handleOptionChange}
            onChange={this.handleChange}
          />
        ) : (
          slots.default()
        )}
        {this.showOptionEditBar && (
          <OptionEditBar
            ref="optionEditBar"
            option-list={this.getOptions}
            showOthers={this.showOthers}
            hasAdvancedConfig={this.hasAdvancedConfig}
            hasAdvancedRateConfig={this.hasAdvancedRateConfig}
            onAddOption={this.handleAddOption}
            onAddOther={this.handleAddOtherOption}
            onOptionChange={this.handleOptionChange}
            onChange={this.handleChange}
          />
        )}
      </div>
    )
  }
})
