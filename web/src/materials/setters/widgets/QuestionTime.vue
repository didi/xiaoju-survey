<template>
  <div class="custom-time-range">
    <el-date-picker
      v-model="begTime"
      type="datetime"
      placeholder="开始日期"
      format="yyyy-MM-dd HH:mm:ss"
      @change="changeData(formConfig.keys[0], $event)"
    >
    </el-date-picker>
    <span class="seporator">至</span>
    <el-date-picker
      v-model="endTime"
      type="datetime"
      placeholder="结束日期"
      format="yyyy-MM-dd HH:mm:ss"
      @change="changeData(formConfig.keys[1], $event)"
    >
    </el-date-picker>
  </div>
</template>
<script>
// 要注意，element的format和moment的format的D是不同的
import moment from 'moment';
// 引入中文
import 'moment/locale/zh-cn';
// 设置中文
moment.locale('zh-cn');
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant';
export default {
  name: 'QuestionTime',
  data() {
    const defaultBeginTime = new Date();
    const defaultEndTime = moment(defaultBeginTime).add(10, 'year').toDate();
    const format = 'yyyy-MM-DD HH:mm:ss';
    return {
      begTime: defaultBeginTime,
      endTime: defaultEndTime,
      format,
      begTimeStr: moment(defaultBeginTime).format(format),
      endTimeStr: moment(defaultEndTime).format(format),
    };
  },
  props: {
    formConfig: {
      type: Object,
      required: true,
    },
  },
  watch: {
    'formConfig.value': {
      handler([begTime, endTime]) {
        if (begTime !== this.begTimeStr) {
          this.begTimeStr = begTime;
          this.begTime = new Date(begTime);
        }
        if (endTime !== this.endTimeStr) {
          this.endTimeStr = endTime;
          this.endTime = new Date(endTime);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    async changeData(key, value) {
      this.$emit(FORM_CHANGE_EVENT_KEY, {
        key,
        value: moment(value).format(this.format),
      });
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.custom-time-range {
  display: flex;

  .seporator {
    margin: 0 10px;
  }
}
</style>
