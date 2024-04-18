import { defineComponent } from 'vue';
import BaseInput from '../BaseInput';

export default defineComponent({
  name: 'SelectMoreData',
  components: { BaseInput },
  props: {
    readonly: Boolean,
    field: String,
    placeholder: String,
    value: String,
  },
  setup(props, { emit }) {
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
    const props = this.$props 
    return (
      <BaseInput
        readonly={this.readonly}
        uiTarget="input"
        { ...props }
        { ...{
          onBlur: this.onBlur,
          onChange: this.onChange,
        } }
      ></BaseInput>
    );
  },
});
