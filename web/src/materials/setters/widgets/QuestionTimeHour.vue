<template>
  <el-time-picker
    is-range
    v-model="value"
    range-separator="-"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
    placeholder="选择时间范围"
    format="HH:mm:ss"
    @change="onTimeChange"
    popper-class="timeRange"
  >
  </el-time-picker>
</template>
<script>
import moment from 'moment';
// 引入中文
import 'moment/locale/zh-cn'
// 设置中文
moment.locale('zh-cn');
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant';

export default {
  name: 'QuestionTimeHour',
  props: {
    formConfig: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      value: [],
      timeValue: [],
    };
  },
  watch: {
    'formConfig.value': {
      handler([answerBeginTime = '00:00:00', answerEndTime = '23:59:59']) {
        if (
          answerBeginTime !== this.timeValue[0] ||
          answerEndTime !== this.timeValue[1]
        ) {
          this.timeValue = [answerBeginTime, answerEndTime];

          const ymd = '2023-01-01';
          const time = [];
          time.push(`${ymd} ${answerBeginTime}`);
          time.push(`${ymd} ${answerEndTime}`);
          this.value = time;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    onTimeChange(data) {
      if (!data) {
        return;
      }
      this.timeValue = data.map((item) => moment(item).format('HH:mm:ss'));
      this.timeValue.forEach((item, i) => {
        this.changeData(this.formConfig.keys[i], item);
      });
    },
    changeData(key, value) {
      this.$emit(FORM_CHANGE_EVENT_KEY, {
        key,
        value,
      });
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.star-question-begAndEndHour {
  display: flex;

  .el-form-item {
    flex: 1;

    .el-date-editor {
      width: 100%;
    }
  }

  .split {
    width: 40px;
    position: relative;

    &::before {
      content: '';
      display: block;
      width: 16px;
      height: 2px;
      background-color: #999;
      position: absolute;
      left: 50%;
      margin-left: -8px;
      top: 50%;
      margin-top: -1px;
    }
  }
}

.timeRange {
  .el-time-panel__btn.confirm {
    color: $primary-color;
  }
}
</style>
