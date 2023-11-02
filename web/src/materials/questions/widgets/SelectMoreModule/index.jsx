import { defineComponent } from 'vue';
import baseInput from '../BaseInput';

export default defineComponent({
  name: 'SelectMoreData',
  components: { baseInput },
  props: {
    readonly: Boolean,
    field: String,
    placeholder: String,
    value: String,
  },
  setup(props, { emit }) {
    // const moduleConfig = ref({
    //   type: 'text'
    // })
    const onBlur = () => {
      emit('blur');
    };
    const onChange = (e) => {
      const key = props.field;
      const value = e.target.value;
      emit('change', {
        key,
        value,
      });
    };
    return {
      // moduleConfig,
      onBlur,
      onChange,
    };
  },
  render() {
    return (
      <baseInput
        readonly={this.readonly}
        uiTarget="input"
        {...{ props: this.$props }}
        {...{
          on: {
            blur: this.onBlur,
            // 'focus': this.onFocus,
            // 'input': this.onInput,
            change: this.onChange,
          },
        }}
      ></baseInput>
    );
  },
});
