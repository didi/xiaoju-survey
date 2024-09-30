import { defineComponent, computed } from 'vue'
import { findIndex, includes, cloneDeep } from 'lodash-es'
import { filterXSS } from '@/common/xss'
import './style.scss'

export default defineComponent({
  name: 'BaseChoice',
  props: {
    uiTarget: {
      type: String,
      default: 'radio'
    },
    hideText: {
      type: Boolean,
      default: false
    },
    isMatrix: {
      type: Boolean,
      default: false
    },
    choiceStyle: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => []
    },
    value: {
      type: [Array, String],
      default: () => {
        return ''
      }
    },
    layout: {
      type: String,
      default: 'vertical'
    },
    voteTotal: {
      type: Number,
      default: 10
    },
  },
  emits: ['change'],
  setup(props, { emit, slots }) {
    const getOptions = computed(() => {
      return props.options
    })
    const isChecked = (item) => {
      if (props.uiTarget === 'radio') {
        return props.value === item.hash
      } else {
        return props.value.includes(item.hash)
      }
    }
    const onRadioClick = (item, $event) => {
      $event && $event.stopPropagation()
      $event && $event.preventDefault()
      if (!isChecked(item)) {
        emit('change', item.hash)
      }
    }
    const onCheckboxClick = (item, $event) => {
      $event && $event.stopPropagation()
      $event && $event.preventDefault()
      const targetValue = item.hash
      const values = cloneDeep(props.value)
      if (!includes(values, targetValue)) {
        values.push(targetValue)
      } else {
        const index = findIndex(values, (val) => val === targetValue)
        if (index !== -1) {
          values.splice(index, 1)
        }
      }
      emit('change', values)
    }
    return {
      slots,
      getOptions,
      isChecked,
      onRadioClick,
      onCheckboxClick
    }
  },
  render() {
    const { uiTarget, isMatrix, hideText, getOptions, isChecked, slots } = this

    return (
      <div class="choice-wrapper">
        <div class={[isMatrix ? 'nest-box' : '', 'choice-box', this.layout || 'vertical']}>
          {getOptions.map((item, index) => {
            return (
              !item.hide && (
                <div
                  key={item.hash || item.value}
                  style={this.choiceStyle}
                  class={['choice-outer']}
                >
                  <div style="position: relative" class="choice-content">
                    {!/^\s*$/.test(item.text) && (
                      <div
                        class={[
                          isChecked(item) ? 'is-checked' : '',
                          index === getOptions.length - 1 ? 'lastchild' : '',
                          index === getOptions.length - 2 ? 'last2child' : '',
                          item.disabled ? 'disabled' : '',
                          'choice-item'
                        ]}
                        onClick={($event) => {
                          if (this.readonly) return
                          if (item.disabled) return
                          if (uiTarget === 'radio') this.onRadioClick(item, $event)
                          if (uiTarget === 'checkbox') this.onCheckboxClick(item, $event)
                        }}
                      >
                        <input
                          ref={uiTarget}
                          type={uiTarget}
                          value={item.value}
                          name={this.name}
                          id={`${uiTarget}${this.name}${index}`}
                          checked={isChecked(item)}
                          disabled={item.disabled}
                          class={[
                            'item-input',
                            isChecked(item) ? 'qicon qicon-gouxuan ql-checked-input' : ''
                          ]}
                        />
                        <label class={'item-title'} for={`${uiTarget}${this.name}${index}`}>
                          {!hideText && (
                            <span
                              v-html={filterXSS(item.text)}
                              class="item-title-text"
                              style="display: block; height: auto; padding-top: 9px"
                            ></span>
                          )}
                          {slots.vote?.({
                            option: item,
                            voteTotal: this.voteTotal
                          })}
                        </label>
                      </div>
                    )}
                  </div>
                  {item.others &&
                    // 如果开启了其他，在运行态需要选中后显示输入框，而预览态直接显示输入框
                    (this.readonly || (!this.readonly && isChecked(item))) &&
                    slots.selectMore?.({
                      showTitle: false,
                      selectMoreConfig: {
                        type: 'selectMoreModule',
                        index: index,
                        field: item.othersKey,
                        placeholder: item.placeholderDesc,
                        require: item.mustOthers,
                        value: item.othersValue
                      }
                    })}
                </div>
              )
            )
          })}
        </div>
      </div>
    )
  }
})
