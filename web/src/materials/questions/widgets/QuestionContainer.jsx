import { computed, defineComponent, onMounted, ref } from 'vue';
import moduleTitle from './Title.jsx';
import EditOptions from './EditOptions.jsx';
import moduleList from '../common/config/moduleList.js';
import '../common/css/question.scss';

import questionLoader from '@/materials/questions/questionLoader.js';
import '../common/css/title.scss';

export const getBlockComponent = async (type) => {
  const path = moduleList[type];
  const component = await questionLoader.loadComponent(type, path);

  return component;
};

export default defineComponent({
  name: 'QuestionContainer',
  props: {
    type: {
      type: String,
      default: 'text',
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    indexNumber: {
      type: [Number, String],
      default: 1,
    },
    moduleConfig: {
      type: Object,
      default: () => {
        return {
          field: 'quiestion01',
          type: 'text',
          component: 'InputModule',
          title: '标题1单行输入框',
          value: '123444',
          showType: 'text',
          placeholder: '请填写',
          textRange: {
            max: {
              placeholder: '500',
              value: 500,
            },
            min: {
              placeholder: '0',
              value: 0,
            },
          },
          valid: 'n',
        };
      },
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    moduleTitle,
  },
  setup(props, { emit }) {
    const blockComponent = ref(null);
    const showEditCom = computed(() => {
      let result = false;
      if (props.isSelected) {
        if (!['text', 'textarea'].includes(props.type)) {
          result = true;
        }
      }
      return result;
    });

    // const isSelected = ref(false)
    onMounted(async () => {
      const { component } = await getBlockComponent(props.type);
      blockComponent.value = component;
    });
    const onBlur = () => {
      emit('blur');
    };
    const onFoucs = () => {
      emit('focus');
    };
    const onChange = (data) => {
      emit('change', data);
    };
    const onClick = () => {
      emit('select', props.indexNumber);
    };
    return {
      // isSelected,
      blockComponent,
      onClick,
      onBlur,
      onFoucs,
      onChange,
      showEditCom,
      // showOthers
    };
  },
  render(h) {
    const { readonly, isSelected } = this;

    const props = {
      isSelected,
      ...this.moduleConfig,
      ...this.$props,
    };
    return (
      <div class={['question', isSelected ? 'isSelected' : '']}>
        {this.showTitle && (
          <moduleTitle {...{ props: props }} {...{ on: this.$listeners }} />
        )}
        <div class="question-block">
          {this.showEditCom
            ? h(
                EditOptions,
                {
                  props: {
                    moduleConfig: this.moduleConfig,
                  },
                },
                [
                  h(
                    this.blockComponent,
                    {
                      props: {
                        readonly,
                        ...props,
                      },
                      on: {
                        blur: this.onBlur,
                        focus: this.onFoucs,
                        change: this.onChange,
                      },
                    },
                    []
                  ),
                ]
              )
            : h(
                this.blockComponent,
                {
                  props: {
                    readonly,
                    ...props,
                  },
                  on: {
                    blur: this.onBlur,
                    focus: this.onFoucs,
                    change: this.onChange,
                  },
                },
                []
              )}
        </div>
      </div>
    );
  },
});
