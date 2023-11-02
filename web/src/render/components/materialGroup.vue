<script>
import { defineComponent } from 'vue';
import Form from './form';
import questionWrapper from '../../materials/questions/widgets/QuestionRuleContainer';

export default defineComponent({
  name: 'MaterialGroup',
  components: { Form },
  props: {
    rules: {
      type: Object,
      default: () => {
        return {};
      },
    },
    formModel: {
      type: Object,
      default: () => {
        return {};
      },
    },
    renderData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props, { emit }) {
    const handleChange = (data) => {
      emit('change', data);
    };
    const handleBlur = () => {
      emit('blur');
    };
    return {
      handleChange,
      handleBlur,
    };
  },
  render(h) {
    const { formModel } = this;
    return (
      <Form ref="ruleForm" props={{ model: formModel }} rules={this.rules}>
        {this.renderData.map((item) => {
          return h(questionWrapper, {
            key: item.field,
            class: 'gap',
            props: {
              moduleConfig: item,
              qIndex: item.qIndex,
              indexNumber: item.indexNumber,
              showTitle: true,
            },
            on: {
              ...this.$listeners,
              change: this.handleChange,
            },
          });
        })}
      </Form>
    );
  },
});
</script>
