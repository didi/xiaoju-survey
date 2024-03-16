<template>
  <el-dialog
    title="选项高级设置"
    custom-class="option-config-wrapper"
    :visible.sync="configVisible"
    :append-to-body="true"
    :width="dialogWidth"
  >
    <div class="J-option-handwrite">
      <div class="option-header">
        <div class="ohItem flex-1" v-if="showText">选项内容</div>
        <div class="ohItem w285" v-if="showOthers">选项后增添输入框</div>
      </div>
      <div>
        <draggable :list="curOptions" :options="{ handle: '.drag-handle' }">
          <div
            class="option-item"
            v-for="(optionItem, index) in curOptions"
            :key="optionItem.hash"
          >
            <span class="drag-handle qicon qicon-tuodong"></span>
            <div class="flex-1 oitem" v-if="showText">
              <div
                contenteditable="true"
                class="render-html"
                v-safe-html="textOptions[index]"
                @blur="onBlur($event, index)"
              ></div>
            </div>
            <div class="oitem moreInfo lh36" v-if="showOthers">
              <el-switch
                :value="optionItem.others"
                @change="(val) => changeOptionOthers(val, optionItem)"
              ></el-switch>
              <div class="more-info-content" v-if="optionItem.others">
                <el-input
                  v-model="optionItem.placeholderDesc"
                  placeholder="提示文案"
                ></el-input>
                <el-checkbox v-model="optionItem.mustOthers">必填</el-checkbox>
              </div>
            </div>
            <div class="operate-area" v-if="showOperateOption">
              <i
                class="add el-icon-circle-plus-outline"
                @click="addOption('选项', false, index)"
              ></i>
              <i
                class="el-icon-remove-outline"
                v-show="curOptions.length > 1"
                @click="deleteOption(index)"
              ></i>
            </div>
          </div>
        </draggable>
      </div>
      <div class="add-btn-row">
        <div
          class="add-option primary-color"
          v-if="showOperateOption"
          @click="addOption()"
        >
          <span>
            <i class="el-icon-circle-plus-outline primary-color"></i>
            添加新选项
          </span>
        </div>

        <div
          v-if="showOperateOption && showOthers"
          class="add-option primary-color"
          @click="addOtherOption"
        >
          <span>
            <extra-icon type="add-square"></extra-icon>
            其他____
          </span>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="configVisible = false">取消</el-button>
      <el-button type="primary" @click="optionConfigChange">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import draggable from 'vuedraggable';
import { forEach as _forEach, cloneDeep as _cloneDeep } from 'lodash-es';
import ExtraIcon from '../ExtraIcon';
import { cleanRichText } from '@/common/xss';

export default {
  name: 'OptionConfig',
  inject: ['moduleConfig'],
  data() {
    return {
      curOptions: _cloneDeep(this.options),
      popoverVisible: false,
    };
  },
  props: {
    options: {
      type: Array,
      default() {
        return [];
      },
    },
    showOptionDialog: {
      type: Boolean,
      default: false,
    },
    dialogWidth: {
      type: String,
      default: '60%',
    },
    showOperateOption: {
      type: Boolean,
      default: true,
    },
    showText: {
      type: Boolean,
      default: true,
    },
    showOthers: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    configVisible: {
      get() {
        return this.showOptionDialog;
      },
      set(newVal) {
        this.$emit('visibleChange', newVal);
      },
    },
    hashMap() {
      const mapData = {};
      _forEach(this.curOptions, (item) => {
        if (item.hash) {
          mapData[item.hash] = true;
        }
      });
      return mapData;
    },
    textOptions() {
      return this.curOptions.map((item) => item.text);
    },
  },
  components: {
    draggable,
    ExtraIcon,
  },
  methods: {
    addOtherOption() {
      const { field } = this.moduleConfig;
      this.addOption('其他', true, -1, field);
    },
    addOption(text = '选项', others = false, index = -1, field) {
      let addOne;
      if (this.curOptions[0]) {
        addOne = _cloneDeep(this.curOptions[0]);
      } else {
        addOne = {
          text: '',
          hash: '',
          others: false,
          mustOthers: false,
          othersKey: '',
          placeholderDesc: '',
          score: 0,
          limit: '',
        };
      }
      for (const i in addOne) {
        if (i === 'others') {
          addOne[i] = others;
          if (others) addOne.othersKey = `${field}_${addOne.hash}`;
        } else if (i === 'mustOthers') {
          addOne[i] = false;
        } else if (i === 'text') {
          addOne[i] = text;
        } else if (i === 'score') {
          addOne[i] = 0;
        }
      }
      addOne.hash = this.getNewHash();
      if (index < 0 || typeof index !== 'number') {
        this.curOptions.push(addOne);
      } else {
        this.curOptions.splice(index + 1, 0, addOne);
      }

      return addOne;
    },
    async deleteOption(index) {
      this.curOptions.splice(index, 1);
    },
    parseImport(newOptions) {
      if (typeof newOptions !== 'undefined' && newOptions.length > 0) {
        this.curOptions = newOptions;
        this.importKey = 'single';
        this.popoverVisible = false;
      } else {
        this.$message.warning('最少保留一项');
      }
    },
    getNewHash() {
      let random = this.getRandom();
      while (random in this.hashMap) {
        random = this.getRandom();
      }
      return random;
    },
    getRandom() {
      return Math.random().toString().slice(-6);
    },
    changeOptionOthers(val, option) {
      const { field } = this.moduleConfig;
      option.others = val;
      if (val) {
        option.othersKey = `${field}_${option.hash}`;
      } else {
        option.othersKey = '';
      }
    },
    optionConfigChange() {
      const arr = [];
      this.curOptions.forEach((item) => {
        item.label !== undefined && item.label !== '' && arr.push(item.label);
      });
      const set = [...new Set(arr)];
      if (set.length < arr.length) {
        this.curOptions.forEach((item, index) => {
          item.label = this.options[index].label || '';
        });
        this.$message.warning('已存在相同的标签内容，请重新输入');
        return;
      }
      this.$emit('optionChange', this.curOptions);
      this.configVisible = false;
    },
    onBlur(e, index) {
      if (cleanRichText(e.target.innerHTML) === '') return;
      this.curOptions[index].text = e.target.innerHTML;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../../common/css/default.scss';
.ceilingPopper {
  max-width: 1000px !important ;
}
.option-config-wrapper {
  .J-option-handwrite {
    .patch-import-btn {
      position: absolute;
      right: 45px;
      top: 54px;
      width: 35px;
      display: flex;
      justify-content: center;
      color: #4a4c5b;
      background: #ffffff;
    }
    .option-header {
      position: relative;
      background: #f9fafc;
      border: 1px solid #edeffc;
      border-radius: 2px;
      font-size: inherit;
      color: #506b7b;
      height: 32px;
      line-height: 32px;
      padding-left: 24px;
      padding-right: 50px;
      display: flex;
      overflow: hidden;
      .el-icon-question {
        cursor: pointer;
      }
      .showMore {
        position: absolute;
        right: 0;
        line-height: 36px;
        transform: rotate(0deg);
        width: 30px;
        text-align: center;
        cursor: pointer;
        font-size: 12px;
        &.toggleLeft {
          transform: rotate(180deg);
        }
      }
      .ohItem {
        margin-right: 8px;
        &.mutex-head {
          text-align: center;
        }
      }
    }
    .option-item {
      display: flex;
      align-items: center;
      margin-top: 10px;
      padding-right: 50px;
      position: relative;
      .oitem {
        margin-right: 8px;
        text-align: center;
        &.moreInfo {
          text-align: left;
        }
        .star-imgupload-icon {
          color: #92949d;
          background-color: #fff !important;
        }
      }
      .icon-mobile {
        line-height: 36px;
        margin-right: 8px;
      }
      .lh36 {
        line-height: 36px;
      }
      .moreInfo {
        width: 285px;
        .more-info-content {
          display: inline-block;
          margin-left: 10px;
          border-bottom: 1px solid #e3e4e8;
          border-radius: 2px;
          .el-input {
            width: 150px;
            ::v-deep .el-input__inner {
              border: none;
            }
          }
          .el-checkbox {
            color: #6e707c;
          }
        }
      }
    }
    .flex-1 {
      flex: 1;
      .render-html {
        border-color: #e3e4e8;
        border-radius: 2px;
        color: #6e707c;
        height: auto;
        padding: 9px 0;
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        width: 100%;
        border: 1px solid #dcdfe6;
      }
    }
    .w50 {
      width: 50px;
    }
    .w100 {
      width: 100px;
    }
    .w285 {
      width: 285px;
    }
    .operate-area {
      width: 50px;
      position: absolute;
      right: 0;
      z-index: 2;
      border-color: #fff;
      font-size: 18px;
      text-align: right;
      i {
        cursor: pointer;
        font-size: inherit;
        &.add {
          margin-right: 8px;
        }
      }
    }
    .sortable-ghost {
      background-color: rgba(0, 0, 0, 0.1) !important;
    }

    .sortable-drag {
      background-color: rgba(0, 0, 0, 0.1) !important;
    }

    .sortable-chosen {
      background-color: rgba(0, 0, 0, 0.1) !important;
    }
    .drag-handle {
      margin-top: 0;
      cursor: move;
    }
    .el-select-dropdown__item {
      font-size: 12px;
      height: 32px;
      line-height: 32px;
    }
    .scoreconf-type-wrapper {
      margin-bottom: 10px;
      .scoreconf-type-label {
        color: #666;
        font-weight: 500;
        height: 30px;
        line-height: 30px;
      }
      .scoreconf-type-select {
        flex: 1;
        margin-left: 20px;
        width: auto;
        .el-radio__label {
          font-size: 12px;
        }
      }
      .score-input {
        flex: 1;
        margin-left: 68px;
        width: 200px;
        .el-radio__label {
          font-size: 12px;
        }
      }
    }
    .add-btn-row {
      color: $primary-color;
      .add-option {
        display: inline-block;
        padding-left: 23px;
        margin-top: 15px;
        margin-bottom: 15px;
        font-size: 12px;
        color: $primary-color;
        cursor: pointer;
        .el-icon-circle-plus {
          padding-right: 6px;
          font-size: 16px;
          vertical-align: -2px;
        }
      }
      .add-option:first-child {
        padding-left: 0;
      }
      .primary-color {
        color: $primary-color;
      }
    }
  }
}
// .el-icon-circle-plus-outline {
//   color: $primary-color;
// }
</style>
