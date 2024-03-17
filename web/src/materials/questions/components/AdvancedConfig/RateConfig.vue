<template>
  <el-dialog
    title="评分高级设置"
    custom-class="option-config-wrapper"
    :visible.sync="innerVisible"
    :append-to-body="true"
    :width="dialogWidth"
  >
    <div class="head">
      <div class="row">
        <div class="score">评分数值</div>
        <div class="explain" v-if="explain">评分释义</div>
        <div class="other">评分后增添输入框</div>
      </div>
    </div>
    <div class="body">
      <div class="row" v-for="item in range" :key="item.index">
        <div class="score">{{ item.index }}</div>
        <div class="explain" v-if="explain">
          <el-input
            class="text"
            v-model="item.explain"
            maxlength="200"
            placeholder="最多200字"
          />
        </div>
        <div class="other">
          <el-switch class="is-show" v-model="item.isShowInput"></el-switch>
          <el-input
            class="text"
            v-show="item.isShowInput"
            v-model="item.text"
            placeholder="提示文案"
          />
          <el-checkbox
            class="required"
            v-show="item.isShowInput"
            v-model="item.required"
            >必填</el-checkbox
          >
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="innerVisible = false">取消</el-button>
      <el-button type="primary" @click="onConfirm">确认</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { get as _get } from 'lodash-es';
import { mapGetters } from 'vuex';
export default {
  props: {
    min: {
      type: Number,
      default: 1,
    },
    max: {
      type: Number,
      default: 5,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    dialogWidth: {
      type: [Number, String],
      default: '600px',
    },
    rangeConfig: {
      type: Object,
      default: () => ({}),
    },
    explain: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    // innerVisible(newVal) {
    // this.$emit('update:visible', newVal)
    // },
  },
  data() {
    return {
      // innerVisible: this.visible,
      range: [],
    };
  },
  created() {
    this.initRange();
  },
  computed: {
    ...mapGetters({
      currentEditKey: 'edit/currentEditKey',
    }),
    innerVisible: {
      get() {
        return this.visible;
      },
      set(newVal) {
        this.$emit('visibleChange', newVal);
      },
    },
  },
  methods: {
    initRange() {
      if (this.min >= this.max) {
        return;
      }
      const res = [];
      for (let i = this.min; i <= this.max; i++) {
        res.push({
          index: i,
          isShowInput: _get(this.rangeConfig, `${i}.isShowInput`) || false,
          text: _get(this.rangeConfig, `${i}.text`) || '',
          required: _get(this.rangeConfig, `${i}.required`) || false,
          explain: _get(this.rangeConfig, `${i}.explain`) || '',
        });
      }
      this.range = res;
    },
    onConfirm() {
      const res = {};
      for (const item of this.range) {
        res[item.index] = {
          isShowInput: item.isShowInput,
          text: item.text,
          required: item.required,
          explain: item.explain,
        };
      }
      const paramsKey = `rangeConfig`;
      const payload = {
        key: `${this.currentEditKey}.${paramsKey}`,
        value: res,
      };
      this.$emit('confirm', payload);
      this.innerVisible = false;
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.row {
  display: flex;
  height: 60px;
  align-items: center;
  border-bottom: 1px solid #eee;
  .score {
    flex-basis: 110px;
    text-align: center;
  }
  .other {
    flex: 1;
    padding-left: 10px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    .is-show {
      margin-right: 10px;
    }
    .text {
      width: 240px;
      margin-right: 10px;
    }
  }
  .explain {
    width: 216px;
  }
}
.head .row {
  border: 1px solid #edeffc;
  background-color: #f9fafc;
}
</style>
