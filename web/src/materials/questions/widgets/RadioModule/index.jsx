import baseChoice from '../BaseChoice';
import { defineComponent } from 'vue';
import QuestionWithRule from '@/materials/questions/widgets/QuestionRuleContainer';

/**
 * 支持配置：
 * 排列方式, layout
 */
export default defineComponent({
  name: 'RadioModule',
  components: { baseChoice, QuestionWithRule },
  props: {
    type: {
      type: String,
      default: '',
    },
    field: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    layout: {
      type: String,
      default: 'vertical',
    },
    options: {
      type: Array,
      default: () => [],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    // moduleConfig: {
    //   type: Object,
    //   default: () => {
    //     return {
    //       field: 'quiestion01',
    //       component: 'RadioModule',
    //       options:  [{
    //           text: '选项2',
    //           hash: 'item1'
    //         }, {
    //           text: '选项2',
    //           hash: 'item2'
    //         }]
    //     }
    //   }
    // }
  },
  emits: ['focus', 'change', 'select', 'blur'],
  setup(props, { emit }) {
    const onChange = (value) => {
      const key = props.field;
      emit('change', {
        key,
        value,
      });
    };
    const handleSelectMoreChange = (data) => {
      const { key, value } = data;
      emit('change', {
        key,
        value,
      });
    };
    return {
      props,
      onChange,
      handleSelectMoreChange,
    };
  },
  render() {
    const { props } = this;
    
    return (
      <div>
        <baseChoice
          uiTarget="radio"
          readonly={props.readonly}
          name={props.field}
          options={props.options}
          value={props.value}
          type={props.type}
          field={props.field}
          layout={props.layout}

          onChange={this.onChange}
        >
          {{
            selectMore: (scoped) => {
              return (
                <QuestionWithRule
                  readonly={this.readonly}
                  showTitle={false}
                  moduleConfig={scoped.selectMoreConfig}
                  onChange={(e) => this.handleSelectMoreChange(e)}
                ></QuestionWithRule>
              );
            },
          }}
        </baseChoice>
      </div>
    );
  },
});
