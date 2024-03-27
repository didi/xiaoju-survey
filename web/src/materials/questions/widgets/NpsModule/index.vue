<template>
  <div class="nps-wrapper-main">
    <div class="nps-row-msg">
      <div class="nps-msg left">{{ minMsg }}</div>
      <div class="nps-msg right">{{ maxMsg }}</div>
    </div>
    <BaseRate
      :name="props.field"
      :min="props.min"
      :max="props.max"
      :readonly="props.readonly"
      :value="indexValue"
      iconClass="number"
      @change="confirmNps"
    />
    <QuestionWithRule
      v-if="isShowInput"
      :showTitle="false"
      :moduleConfig="moduleConfig"
      @change="onMoreDataChange"
    ></QuestionWithRule>
  </div>
</template>
<script setup>
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
  rating.value = num + '';
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
.nps-wrapper-main {
  .nps-row-msg {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.2rem;
    .nps-msg {
      flex: 1;
      font-size: 0.22rem;
      color: #92949d;
      &.left {
        text-align: left;
      }
      &.right {
        text-align: right;
      }
    }
  }
  .star-wrapper-main {
    .star-item {
      &:hover {
        background-color: $primary-color;
      }
    }
    &:has(.star-item:hover) .star-item:not(:hover, :hover ~ *) {
      background-color: $primary-color;
    }
  }
}
.nps-select-config {
  width: 312px;
}
.nps-rate-config {
  .row {
    height: 47px;
  }
  .text {
    input {
      height: 32px;
    }
  }
}
.nps-customed-config {
  .el-form-item__label {
    width: 70px !important;
    margin-right: 8px;
  }
  .el-input__inner {
    width: 234px;
  }
  .el-form-item {
    margin-right: 0;
  }
}
</style>
