import { defineComponent, ref, nextTick, computed, inject, h, unref, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'

import '../common/css/formItem.scss'
import QuestionContainerC from '@/materials/questions/widgets/QuestionContainerC.jsx'
import ErrorTip from '../components/ErrorTip.vue'
import { assign } from 'lodash-es'
import AsyncValidator from 'async-validator'
export default defineComponent({
  name: 'QuestionRuleContainer',
  components: { ErrorTip },
  props: {
    readonly: Boolean,
    showTitle: Boolean,
    moduleConfig: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showSpliter: {
      type: Boolean,
      default: false
    },
    indexNumber: {
      type: [Number, String],
      default: 1
    }
  },
  emits: ['focus', 'change', 'select', 'blur'],
  setup(props, { emit }) {
    const validateMessage = ref('')
    const validateState = ref('')
    const { proxy: instance } = getCurrentInstance();
    const form = inject('Form', {
      default: {},
      type: Object
    })
    const $bus = inject('$bus')

    const itemClass = computed(() => {
      const classList = []
      classList.push(props.moduleConfig.direction)
      const type = props.moduleConfig.type
      if (type) {
        if (type === 'section') {
          classList.push('question-type-section')
        }

        if (type === 'scroll') {
          classList.push('no-padding')
        }
        if (type === 'user-agreement') {
          classList.push('no-out-padding')
        }
      }
      return classList.join(' ')
    })

    const show = computed(() => {
      const { type } = props.moduleConfig
      return !/hidden|mobileHidden/.test(type)
    })
    
    onMounted(() => {
      $bus.emit && $bus.emit('form.addField', instance);
    });

    onBeforeUnmount(() => {
      $bus.emit && $bus.emit('form.removeField', instance);
    });
    
    const validate = (trigger, callback = () => {}) => {
      const rules = getFilteredRule(trigger)
      if (!rules || rules.length === 0) {
        callback && callback()
        return true
      }

      const { field, options } = props.moduleConfig

      const descriptor = {}
      if (rules && rules.length > 0) {
        rules.forEach((rule) => {
          // eslint-disable-next-line no-param-reassign
          delete rule.trigger
        })
      }
      // 有选项的题才需要判断这步，如果没有选项，就不校验，如果有，就要校验
      if (options && options.length) {
        const trueOptions = options.filter((i) => !i.hide)
        if (trueOptions.length === 0) {
          callback && callback()
          return true
        }
      }

      descriptor[field] = rules
      const validator = new AsyncValidator(descriptor)
      //  因为有些input的value是bind上去的，所以应该在下一帧再去校验，否则会出现第一次blur没反应
      nextTick(() => {
        // 对填空题单独设置其value
        let value = unref(form.model)[field]
        validator.validate({ [field]: value }, { firstFields: true }, (errors) => {
          validateState.value = !errors ? 'success' : 'error'
          validateMessage.value = errors ? errors[0].message : ''
          callback && callback(validateMessage.value)
        })
      })
    }
    const onFieldBlur = () => {
      validate('blur')
    }
    const onFieldChange = () => {
      validate('change')
    }
    const getRules = () => {
      const rules = unref(form.rules)
      const { field } = props.moduleConfig
      return rules[field]
    }
    const getFilteredRule = (trigger) => {
      let rules = getRules()
      if (!rules) {
        rules = []
      }
      return rules
        .filter((rule) => !rule.trigger || rule.trigger.indexOf(trigger) !== -1)
        .map((rule) => assign({}, rule))
    }
    const handleBlur = () => {
      emit('blur')
      onFieldBlur()
    }
    const handleChange = (data) => {
      emit('change', data)
      onFieldChange()
    }
    return {
      validateMessage,
      validate,
      itemClass,
      show,
      onFieldBlur,
      onFieldChange,
      getRules,
      getFilteredRule,
      handleBlur,
      handleChange
    }
  },
  render() {
    const { itemClass, validateMessage } = this
    return (
      <div
        class={[
          'question-wrapper',
          this.moduleConfig.showSpliter ? 'spliter' : '',
          validateMessage ? 'hasError' : '',
          itemClass
        ]}
      >
        {h(QuestionContainerC, {
          type: this.moduleConfig.type,
          moduleConfig: this.moduleConfig,
          value: this.moduleConfig.value,
          indexNumber: this.indexNumber,
          showTitle: this.showTitle,
          readonly: this.readonly,
          onBlur: this.handleBlur,
          onChange: this.handleChange
        })}
        <ErrorTip msg={validateMessage} />
      </div>
    )
  }
})
