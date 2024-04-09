
<script lang="jsx">
import { defineProps, defineEmits, computed } from 'vue';
import QuestionWithRule from '@/materials/questions/widgets/QuestionRuleContainer';
import BaseRate from '../BaseRate';
const props = defineProps({
  field: {
    type: [String, Number],
    default: '',
  },
  value: {
    type: [String, Number],
    default: '',
  },
  min: {
    type: Number,
    default: 1,
  },
  max: {
    type: Number,
    default: 10,
  },
  minMsg: {
    type: String,
    default: '',
  },
  maxMsg: {
    type: String,
    default: '',
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
});
const emit = defineEmits(['change']);

const npsClass = !props.readonly ? 'radio-nps-hover' : '';

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

const confirmNps = (num) => {
  if (props.readonly) return;
  rating.value = num;
};

const minMsg = computed(() => {
  return props.minMsg || '极不满意';
});

const maxMsg = computed(() => {
  return props.maxMsg || '十分满意';
});

const indexValue = computed(() => {
  return props.value !== '' ? props.value : -1;
});
const currentRangeConfig = computed(() => {
  return props.rangeConfig[rating.value];
});
const isShowInput = computed(() => {
  return currentRangeConfig.value?.isShowInput;
});
const moduleConfig = computed(() => {
  return {
    type: 'selectMoreModule',
    field: `${props.field}_${rating.value}`,
    placeholder: props.rangeConfig[rating.value]?.text,
    value: props.rangeConfig[rating.value]?.othersValue || '',
  };
});

const onMoreDataChange = (data) => {
  const { key, value } = data;
  emit('change', {
    key,
    value,
  });
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
