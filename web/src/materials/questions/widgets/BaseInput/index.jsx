import { defineComponent } from 'vue';
import '../../common/css/choice.scss';
import '../../common/css/input.scss';

export default defineComponent({
  name: 'baseInput',
  props: {
    uiTarget: {
      type: String,
      default: 'radio',
    },
    customClass: {
      type: String,
      default: '',
    },
    type: {
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
    placeholder: {
      type: String,
      default: '请填写',
    },
    maxlength: {
      type: Number,
      default: 500,
    },
    minlength: {
      type: Number,
      default: 0,
    },
    value: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const onBlur = () => {
      emit('blur');
    };
    const onInput = (e) => {
      emit('input', e);
    };
    const onChange = (e) => {
      emit('change', e);
    };
    const onFocus = () => {
      if (props.readonly) return false;
      emit('focus');
    };
    return {
      onBlur,
      onInput,
      onFocus,
      onChange,
    };
  },
  render(h) {
    const { uiTarget, customClass } = this;
    return (
      <div class="input-wrapper">
        {h(
          uiTarget,
          {
            // class: ['input-box','item-border', ],
            class: ['input-box item-border', customClass],
            attrs: {
              type: this.type,
              readonly: this.readonly,
              placeholder: this.placeholder,
              name: this.name,
              value: this.value,
              maxlength: this.maxlength,
              minlength: this.minlength,
              autocomplete: 'off',
            },
            on: {
              blur: this.onBlur,
              input: this.onInput,
              focus: this.onFocus,
              change: this.onChange,
            },
          },
          [this.value]
        )}
        {this.$slots.default}
        {/* {this.$scopedSlots.default} */}
        {/* {renderSlot(this.$slots, 'default')}   */}
      </div>
    );
  },
});
