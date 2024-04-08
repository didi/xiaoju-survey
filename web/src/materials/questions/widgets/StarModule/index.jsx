import { defineComponent, computed,ref,nextTick} from 'vue';
import '../../common/css/radioStar.scss';
import BaseRate from '../BaseRate';
import QuestionWithRule from '@/materials/questions/widgets/QuestionRuleContainer';
export default defineComponent({
  name: 'StarModule',
  components: { BaseRate, QuestionWithRule },
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
      type: [String, Number],
      default: 0,
    },
    starMin: {
      type: Number,
      default: 1,
    },
    starMax: {
      type: Number,
      default: 5,
    },
    starStyle: {
      type: String,
      default: 'star',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    rangeConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props, { emit }) {
    const rating = computed({
      get() {
        return props.value;
      },
      set(val) {
        const key = props.field;
        emit('change', {
          key,
          value: val,
        });
      },
    });
    const withRuleRef = ref(null);
    const currentRangeConfig = computed(() => {
      return props.rangeConfig[rating.value];
    });
    const isShowInput = computed(() => {
      return currentRangeConfig.value?.isShowInput;
    });
    const starClass = computed(() => {
      const { starStyle } = props;
      switch (starStyle) {
        case 'star':
          return 'qicon qicon-xingxing';
        case 'love':
          return 'qicon qicon-aixin';
        case 'number':
          return 'number';
        default:
          return 'qicon qicon-xingxing';
      }
    });
    const confirmStar = (num) => {
      if (props.readonly) return;
      rating.value = num;
      resetOthersError(num)
    };

    const resetOthersError = (num) => {
      nextTick(() => {
        const { required, othersKey } = props.rangeConfig[num];
        if (!required && othersKey && withRuleRef.value && withRuleRef.value.validateMessage) {
          withRuleRef.value.validateMessage = '';
        }
     })
    }

    const onMoreDataChange = (data) => {
      const { key, value } = data;
      emit('change', {
        key,
        value,
      });
    };
    return {
      rating,
      currentRangeConfig,
      starClass,
      isShowInput,
      withRuleRef,
      confirmStar,
      onMoreDataChange,
    };
  },
  render() {
    const {
      field,
      value,
      rating,
      readonly,
      starClass,
      currentRangeConfig,
      isShowInput,
      onMoreDataChange,
      rangeConfig,
    } = this;

    return (
      <div class="star-wrapper-main">
        <BaseRate
          name={field}
          value={value}
          readonly={readonly}
          iconClass={starClass}
          onChange={this.confirmStar}
        />
        {currentRangeConfig && (
          <p class="explain radio-star">{currentRangeConfig.explain}</p>
        )}
        {isShowInput && (
          <QuestionWithRule
            showTitle={false}
            ref={el => this.withRuleRef = el}
            moduleConfig={{
              type: 'selectMoreModule',
              field: `${this.field}_${this.rating}`,
              placeholder: rangeConfig[rating]?.text,
              value: rangeConfig[rating]?.othersValue || '',
            }}
            onChange={(e) => onMoreDataChange(e)}
          ></QuestionWithRule>
        )}
      </div>
    );
  },
});
