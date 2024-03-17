<template>
  <div class="option-edit-wrap">
    <draggable
      id="sortDraggable"
      :list="optionList"
      :options="{ handle: '.drag-handle' }"
      @update="optionSortChange"
    >
      <div
        class="draggdiv dragg-handle"
        v-for="(item, index) in optionList"
        :key="index"
      >
        <span class="drag-handle qicon qicon-tuodong"></span>
        <div class="input-box">
          <EditorV2
            :realData="item.text"
            @change="(value) => handleChange(index, value)"
            :is-show-operation="isShowOperation"
          />
        </div>

        <i
          v-if="isShowOperation"
          class="icon el-icon-circle-plus-outline"
          @click="onAddOption(index)"
        ></i>
        <el-tooltip
          v-if="isShowOperation"
          v-show="optionList.length > 1"
          class="icon delete"
          effect="dark"
          content="删除"
          placement="top"
        >
          <i class="el-icon-remove-outline" @click="deleteOption(index)"></i>
        </el-tooltip>
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { mapGetters } from 'vuex';
import { cloneDeep as _cloneDeep } from 'lodash-es';
import EditorV2 from '@/common/Editor/EditorV2';

export default {
  name: 'OptionEdit',
  computed: {
    ...mapGetters({
      currentEditKey: 'edit/currentEditKey',
    }),
  },
  props: {
    optionList: {
      type: Array,
    },
    isShowOperation: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    draggable,
    EditorV2,
  },
  mounted() {
    // 选项hash兜底
    const hashMap = {};
    let hashHasChanged = false;
    for (const item of this.optionList) {
      if (!item.hash) {
        item.hash = this.getNewHash(hashMap);
        hashHasChanged = true;
      }
    }
    const originOptionList = _cloneDeep(this.optionList);
    if (hashHasChanged) {
      this.$emit('optionChange', originOptionList);
    }
  },
  methods: {
    getRandom() {
      return Math.random().toString().slice(-6);
    },
    getNewHash(hashMap) {
      let random = this.getRandom();
      while (random in hashMap) {
        random = this.getRandom();
      }
      return random;
    },
    handleChange(index, value) {
      // 更新单个选项文案
      const optionKey = `options[${index}].text`;
      const key = `${this.currentEditKey}.${optionKey}`;
      this.$emit('change', { key, value });
    },
    onAddOption(index) {
      this.$emit('addOption', '选项', false, index);
    },
    async deleteOption(index) {
      const optionList = _cloneDeep(this.optionList);
      optionList.splice(index, 1);
      this.$emit('optionChange', optionList);
    },
    optionSortChange() {
      const optionList = _cloneDeep(this.optionList);
      this.$emit('optionChange', optionList);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../../common/css/default.scss';
.option-edit-wrap {
  .focus {
    margin-top: 31px;
    .input-box {
      padding: 0 !important;
    }
  }
  #sortDraggable {
    user-select: none;
    padding-right: 0.08rem;
    .sortable-drag,
    .sortable-ghost {
      border-color: $primary-color;
      border-radius: 0.04rem;
    }
    .sortable-fallback {
      background-color: $primary-color;
    }
  }
  .draggdiv {
    display: block;
    .remainText {
      font-size: 0.24rem;
      margin-left: 10px;
      color: red;
      width: 100%;
    }
    cursor: move;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    border: 1px solid transparent;
    // border: 1px dashed $placeholder-color;
    // border-left: 3px solid $placeholder-color;
    margin-bottom: 10px;
    padding-right: 7px;
    position: relative;
    height: auto;
    .input-box {
      display: inline-block;
      height: auto;
      min-width: 210px;
      flex: 1;
      position: relative;
      align-items: center;
      border: 1px solid transparent;
      border-left: 3px solid transparent;
      margin-right: 10px;
      // padding: 10px 0;
      .fn-box {
        display: none;
        position: absolute;
        height: 28px;
        padding: 0 6px;
        left: 0;
        top: -28px;
        box-shadow: 0 0 3px 3px #eee;
        background-color: #fff;
      }
    }
    .icon-mobile {
      color: $light-focus-color;
      visibility: hidden;
    }
    .img-option {
      //  display: none;
      display: inline-block;
    }
    .el-icon-error {
      visibility: hidden;
    }
    .icon {
      margin-left: 4px;
      font-size: 17px;
      color: #888;
      cursor: pointer;
    }
    .icon.delete:hover {
      color: red;
    }
    &.dragg-handle {
      border: 1px solid transparent;
      // border-left: 3px solid $placeholder-color;
      // background: rgba(242, 244, 247, 0.5);
      .icon-mobile {
        visibility: visible;
      }
      .img-option {
        display: inline-block;
      }
      .el-icon-error {
        visibility: visible;
      }

      .input-box {
        margin-left: 5px;
        background-color: #fff;
        border: 1px solid #e3e4e6;
        border-radius: 2px;
      }
    }
    &.dragg-handle-focus {
      .input-box {
        padding: 0 !important;
        .fn-box {
          display: inline-block;
        }
      }
    }
    .icon-mobile {
      margin-left: 5px;
    }
    .item-text-input {
      width: 200px;
      .el-input__inner {
        border: none;
        background: none;
      }
    }
    .input-div {
      margin-left: 12px;
      color: #6e707c;
    }
    .item-type-input {
      position: relative;
      vertical-align: top;
      width: 0.32rem;
      height: 0.32rem;
      margin-left: 0.1rem;
      border: 1px solid $border-color;
      border-radius: 100%;
      background-color: #fff;
    }
    .checkbox-type-input {
      border-radius: 0;
    }
    .img-option {
      .star-imgupload-icon {
        color: #92949d;
        background: transparent;
        padding: 0 5px;
        .biz-upload-input {
          cursor: pointer;
          width: 27px;
        }
      }
    }
    .el-icon-error {
      margin-left: 10px;
      margin-right: 5px;
      cursor: pointer;
      color: #92949d;
    }
  }
  .dragg-handle-focus {
    .input-box {
      padding: 0 !important;
    }
  }
  .radio-select-config {
    margin-top: 20px;
    font-size: 12px;
    .add-option {
      line-height: 24px;
      cursor: pointer;
      .el-icon-circle-plus {
        padding-right: 4px;
        font-size: 17px;
        vertical-align: -2px;
      }
    }
    .option-advanced-config {
      line-height: 24px;
      float: right;
      color: #0f8a82;
      cursor: pointer;
    }
  }
}
</style>
