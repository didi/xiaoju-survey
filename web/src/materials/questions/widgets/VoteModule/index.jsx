import { computed, defineComponent } from 'vue';
import baseChoice from '../BaseChoice';
import Progress from '../../components/Progress.vue';
import '../../common/css/vote.scss';
import QuestionWithRule from '@/materials/questions/widgets/QuestionRuleContainer';
import { includes } from 'lodash-es';
export default defineComponent({
  name: 'VoteModule',
  components: { baseChoice, Progress, QuestionWithRule },
  props: {
    innerType: {
      type: String,
      default: 'radio',
    },
    field: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Array],
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
    voteTotal: {
      type: Number,
      default: 10,
    },
    maxNum: {
      type: [Number, String],
      default: 1,
    },
  },
  setup(props, { emit }) {
    const disableState = computed(() => {
      if (!props.maxNum) {
        return false;
      }
      return props.value.length >= +props.maxNum;
    });
    const isDisabled = (item) => {
      const { value } = props;
      return disableState.value && !includes(value, item.value);
    };
    const myOptions = computed(() => {
      const { options } = props;
      if (props.innerType === 'checkbox') {
        return options.map((item) => {
          return {
            ...item,
            disabled: isDisabled(item),
          };
        });
      } else {
        return options;
      }
    });
    const calcVotePercent = (option, total) => {
      const { voteCount = 0 } = option;
      const voteTotal = total || 0;

      if (voteTotal === 0) {
        return '0.0';
      }
      return ((voteCount * 100) / voteTotal).toFixed(1);
    };
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
      myOptions,
      calcVotePercent,
      onChange,
      handleSelectMoreChange,
    };
  },
  render() {
    const { calcVotePercent, innerType, field, myOptions } = this;
    const props = {
      ...this.$props,
      options: myOptions,
      layout: 'vertical',
      readonly: this.readonly,
      name: field,
    };
    return (
      <baseChoice
        uiTarget={innerType}
        {...{ props: props }}
        {...{
          on: {
            change: this.onChange,
          },
        }}
        scopedSlots={{
          vote: (scoped) => {
            return (
              <div class="vote-detail">
                <Progress
                  process-conf={{
                    percent: `${calcVotePercent(
                      scoped.option,
                      scoped.voteTotal
                    )}%`,
                  }}
                />
                <div class="vote-percent">{`${calcVotePercent(
                  scoped.option,
                  scoped.voteTotal
                )}%`}</div>
                <div class="vote-count">{`${
                  scoped.option.voteCount || 0
                }票`}</div>
              </div>
            );
          },
          selectMore: (scoped) => {
            return (
              <QuestionWithRule
                showTitle={false}
                moduleConfig={scoped.selectMoreConfig}
                onChange={(e) => this.handleSelectMoreChange(e)}
              ></QuestionWithRule>
            );
          },
        }}
      ></baseChoice>
    );
  },
});
