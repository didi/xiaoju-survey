import { defineComponent, computed } from 'vue';
import { findIndex, includes } from 'lodash-es';
import { filterXSS } from '@/common/xss';
import '../../common/css/choice.scss';

export default defineComponent({
  name: 'BaseChoice',
  props: {
    uiTarget: {
      type: String,
      default: 'radio',
    },
    hideText: {
      type: Boolean,
      default: false,
    },
    isMatrix: {
      type: Boolean,
      default: false,
    },
    choiceStyle: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: () => [],
    },
    value: {
      type: [Array, String],
      default: () => {
        return '';
      },
    },
    layout: {
      type: String,
      default: 'vertical',
    },
    voteTotal: {
      type: Number,
      default: 10,
    },
  },
  setup(props, { emit }) {
    const getOptions = computed(() => {
      return props.options;
    });
    const isChecked = (item) => {
      if (props.uiTarget === 'radio') {
        return props.value === item.hash;
      } else {
        return props.value.includes(item.hash);
      }
    };
    const onRadioClick = (item, $event) => {
      $event && $event.stopPropagation();
      $event && $event.preventDefault();
      emit('change', item.hash);
    };
    const onCheckboxClick = (item, $event) => {
      $event && $event.stopPropagation();
      $event && $event.preventDefault();
      const targetValue = item.hash;
      let values = props.value;
      if (!includes(values, targetValue)) {
        values.push(targetValue);
      } else {
        const index = findIndex(values, (val) => val === targetValue);
        if (index !== -1) {
          values.splice(index, 1);
        }
      }
      emit('change', values);
      // return values
    };
    return {
      getOptions,
      isChecked,
      onRadioClick,
      onCheckboxClick,
    };
  },
  render() {
    const { uiTarget, isMatrix, hideText, getOptions, isChecked } = this;
    return (
      <div class="choice-wrapper">
        <div class={[isMatrix ? 'nest-box' : '', 'choice-box']}>
          {getOptions.map((item, index) => {
            return (
              !item.hide && (
                <div
                  key={item.hash || item.value}
                  style={this.choiceStyle}
                  class={['choice-outer']}
                >
                  <div style="position: relative">
                    {!/^\s*$/.test(item.text) && (
                      <div
                        class={[
                          this.layout === 'vertical' ? 'vertical' : '',
                          isChecked(item) ? 'is-checked' : '',
                          index === getOptions.length - 1 ? 'lastchild' : '',
                          index === getOptions.length - 2 ? 'last2child' : '',
                          item.disabled ? 'disabled' : '',
                          'choice-item',
                        ]}
                        onClick={($event) => {
                          if (this.readonly) return;
                          if (item.disabled) return;
                          if (uiTarget === 'radio')
                            this.onRadioClick(item, $event);
                          if (uiTarget === 'checkbox')
                            this.onCheckboxClick(item, $event);
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
                            isChecked(item)
                              ? 'qicon qicon-gouxuan ql-checked-input'
                              : '',
                          ]}
                        />
                        <label
                          class={'item-title'}
                          for={`${uiTarget}${this.name}${index}`}
                        >
                          {!hideText && (
                            <span
                              domPropsInnerHTML={filterXSS(item.text)}
                              class="item-title-text"
                              style="display: block; height: auto; padding: 9px 0"
                            ></span>
                          )}
                          {this.$scopedSlots.vote?.({
                            option: item,
                            voteTotal: this.voteTotal,
                          })}
                        </label>
                      </div>
                    )}
                  </div>
                  {!this.readonly
                    ? item.others &&
                      isChecked(item) &&
                      this.$scopedSlots.selectMore?.({
                        showTitle: false,
                        selectMoreConfig: {
                          type: 'selectMoreModule',
                          index: index,
                          field: item.othersKey,
                          placeholder: item.placeholderDesc,
                          require: item.mustOthers,
                          value: item.othersValue,
                        },
                      })
                    : item.others &&
                      this.$scopedSlots.selectMore?.({
                        showTitle: false,
                        selectMoreConfig: {
                          type: 'selectMoreModule',
                          index: index,
                          field: item.othersKey,
                          placeholder: item.placeholderDesc,
                          require: item.mustOthers,
                          value: item.othersValue,
                        },
                      })}
                </div>
              )
            );
          })}
        </div>
      </div>
    );
  },
});
