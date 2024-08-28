<template>
  <div>
    <span class="primary-color" @click="openOptionConfig"> 评分高级设置 > </span>

    <el-dialog
      title="评分高级设置"
      custom-class="option-config-wrapper"
      v-model="configVisible"
      :append-to-body="true"
      width="800px"
    >
      <div class="head">
        <div class="row">
          <div class="score">评分数值</div>
          <div class="explain" v-if="isStar">评分释义</div>
          <div class="other">评分后增添输入框</div>
        </div>
      </div>
      <div class="body">
        <div class="row" v-for="item in range" :key="item.index">
          <div class="score">{{ item.index }}</div>
          <div class="explain" v-if="isStar">
            <el-input class="text" v-model="item.explain" maxlength="200" placeholder="最多200字" />
          </div>
          <div class="other">
            <el-switch class="is-show" v-model="item.isShowInput"></el-switch>
            <el-input
              class="text"
              v-show="item.isShowInput"
              v-model="item.text"
              placeholder="提示文案"
            />
            <el-checkbox class="required" v-show="item.isShowInput" v-model="item.required"
              >必填</el-checkbox
            >
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="configVisible = false">取消</el-button>
          <el-button type="primary" @click="onConfirm">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { get as _get } from 'lodash-es'
import { useEditStore } from '@/management/stores/edit'
import { QUESTION_TYPE } from '@/common/typeEnum'

const editStore = useEditStore()

export default {
  data() {
    return {
      range: [],
      configVisible: false
    }
  },
  mounted() {
    this.initRange()
  },
  computed: {
    isStar() {
      return editStore.moduleConfig.type === QUESTION_TYPE.RADIO_STAR
    },
    isNps() {
      return editStore.moduleConfig.type === QUESTION_TYPE.RADIO_NPS
    },
    min() {
      const { min = 1, starMin = 1 } = editStore.moduleConfig
      return this.isNps ? min : starMin
    },
    max() {
      const { max = 5, starMax = 5 } = editStore.moduleConfig
      return this.isNps ? max : starMax
    }
  },
  watch: {
    min(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.initRange()
      }
    },
    max(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.initRange()
      }
    }
  },
  methods: {
    openOptionConfig() {
      this.configVisible = true
    },
    initRange() {
      if (this.min >= this.max) {
        return
      }
      const res = []
      const rangeConfig = editStore.moduleConfig.rangeConfig

      for (let i = this.min; i <= this.max; i++) {
        res.push({
          index: i,
          isShowInput: _get(rangeConfig, `${i}.isShowInput`) || false,
          text: _get(rangeConfig, `${i}.text`) || '',
          required: _get(rangeConfig, `${i}.required`) || false,
          explain: _get(rangeConfig, `${i}.explain`) || ''
        })
      }
      this.range = res
    },
    onConfirm() {
      const res = {}
      for (const item of this.range) {
        res[item.index] = {
          isShowInput: item.isShowInput,
          text: item.text,
          required: item.required,
          explain: item.explain
        }
      }

      this.$emit('handleChange', {
        key: `rangeConfig`,
        value: res
      })
      this.configVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.primary-color {
  color: $primary-color;
}

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
