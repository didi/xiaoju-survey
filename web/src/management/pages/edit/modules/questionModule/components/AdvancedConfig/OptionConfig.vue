<template>
  <div>
    <span class="primary-color" @click="openOptionConfig"> 高级设置 > </span>

    <el-dialog
      title="选项高级设置"
      class="option-config-wrapper"
      v-model="configVisible"
      :append-to-body="true"
      width="60%"
      size="large"
    >
      <div class="option-handwrite">
        <div class="option-header">
          <div class="header-item flex-1">选项内容</div>
          <div class="header-item w285">选项后增添输入框</div>
        </div>
        <div>
          <draggable :list="curOptions" handle=".drag-handle" itemKey="hash">
            <template #item="{ element, index }">
              <div class="option-item">
                <span class="drag-handle qicon qicon-tuodong"></span>
                <div class="flex-1 oitem">
                  <div
                    contenteditable="true"
                    class="render-html"
                    v-html="textOptions[index]"
                    @blur="onBlur($event, index)"
                  ></div>
                </div>
                <div class="oitem moreInfo lh36">
                  <el-switch
                    :modelValue="element.others"
                    @change="(val) => changeOptionOthers(val, element)"
                  ></el-switch>
                  <div class="more-info-content" v-if="element.others">
                    <el-input v-model="element.placeholderDesc" placeholder="提示文案"></el-input>
                    <el-checkbox v-model="element.mustOthers">必填</el-checkbox>
                  </div>
                </div>

                <div class="operate-area">
                  <i-ep-circlePlus class="area-btn-icon" @click="addOption('选项', false, index)" />
                  <i-ep-remove
                    v-show="curOptions.length"
                    class="area-btn-icon"
                    @click="deleteOption(index)"
                  />
                </div>
              </div>
            </template>
          </draggable>
        </div>
        <div class="add-btn-row">
          <div class="add-option" @click="addOption()">
            <span class="add-option-item"> <i-ep-circlePlus class="icon" /> 添加新选项 </span>
          </div>

          <div class="add-option" @click="addOtherOption">
            <span class="add-option-item"> <i-ep-circlePlus class="icon" /> 其他____ </span>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="configVisible = false">取消</el-button>
          <el-button type="primary" @click="optionConfigChange">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { forEach as _forEach, cloneDeep as _cloneDeep } from 'lodash-es'

import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'

import { useEditStore } from '@/management/stores/edit'
import { cleanRichText } from '@/common/xss'
import { cleanRichTextWithMediaTag } from '@/common/xss'

export default {
  name: 'OptionConfig',
  props: {
    fieldId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      configVisible: false,
      curOptions: []
    }
  },
  computed: {
    options() {
      const editStore = useEditStore()
      return editStore.moduleConfig.options
    },
    hashMap() {
      const mapData = {}
      _forEach(this.curOptions, (item) => {
        if (item.hash) {
          mapData[item.hash] = true
        }
      })
      return mapData
    },
    textOptions() {
      return this.curOptions.map((item) => cleanRichTextWithMediaTag(item.text))
    }
  },
  components: {
    draggable
  },
  mounted() {
    this.initCurOption()
  },
  watch: {
    options: {
      handler(val) {
        this.curOptions = _cloneDeep(val)
      },
      deep: true
    }
  },
  methods: {
    initCurOption() {
      const editStore = useEditStore()
      this.curOptions = _cloneDeep(editStore.moduleConfig.options)
    },
    addOtherOption() {
      this.addOption('其他', true, -1, this.fieldId)
    },
    openOptionConfig() {
      this.configVisible = true
      this.initCurOption()
    },
    addOption(text = '选项', others = false, index = -1, fieldId) {
      let addOne = {
        text: '',
        hash: '',
        others: false,
        mustOthers: false,
        othersKey: '',
        placeholderDesc: ''
      }
      for (const i in addOne) {
        if (i === 'others') {
          addOne[i] = others
          if (others) addOne.othersKey = `${fieldId}_${addOne.hash}`
        } else if (i === 'mustOthers') {
          addOne[i] = false
        } else if (i === 'text') {
          addOne[i] = text
        } else if (i === 'score') {
          addOne[i] = 0
        }
      }
      addOne.hash = this.getNewHash()
      if (index < 0 || typeof index !== 'number') {
        this.curOptions.push(addOne)
      } else {
        this.curOptions.splice(index + 1, 0, addOne)
      }

      return addOne
    },
    deleteOption(index) {
      this.curOptions.splice(index, 1)
    },
    parseImport(newOptions) {
      if (typeof newOptions !== 'undefined' && newOptions.length > 0) {
        this.curOptions = newOptions
        this.importKey = 'single'
      } else {
        ElMessage.warning('最少保留一项')
      }
    },
    getNewHash() {
      let random = this.getRandom()
      while (random in this.hashMap) {
        random = this.getRandom()
      }
      return random
    },
    getRandom() {
      return Math.random().toString().slice(-6)
    },
    changeOptionOthers(val, option) {
      option.others = val
      if (val) {
        option.othersKey = `${this.fieldId}_${option.hash}`
      } else {
        option.othersKey = ''
      }
    },
    optionConfigChange() {
      const arr = []
      this.curOptions.forEach((item) => {
        item.label !== undefined && item.label !== '' && arr.push(item.label)
      })
      const set = [...new Set(arr)]
      if (set.length < arr.length) {
        this.curOptions.forEach((item, index) => {
          item.label = this.options[index].label || ''
        })
        ElMessage.warning('已存在相同的标签内容，请重新输入')
        return
      }
      this.$emit('handleChange', { key: 'options', value: this.curOptions })
      this.configVisible = false
    },
    onBlur(e, index) {
      if (cleanRichText(e.target.innerHTML) === '') return
      this.curOptions[index].text = e.target.innerHTML
    }
  }
}
</script>

<style lang="scss" scoped>
.primary-color {
  color: $primary-color;
}

.option-config-wrapper {
  .option-handwrite {
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

      .option-item {
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
            :deep(.el-input__wrapper) {
              box-shadow: none;
            }
          }
          .el-checkbox {
            color: #6e707c;
          }
        }
      }

      .area-btn-icon {
        margin-right: 5px;
        cursor: pointer;
        font-size: 16px;
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
      .el-icon {
        cursor: pointer;
        font-size: inherit;
        &:first-child {
          margin-right: 8px;
        }
      }
    }
    .drag-handle {
      margin-top: 0;
      cursor: move;
    }

    .add-btn-row {
      color: $primary-color;
      display: flex;
      align-items: center;
      .add-option {
        padding-left: 23px;
        margin-top: 15px;
        margin-bottom: 15px;
        font-size: 12px;
        cursor: pointer;
        .add-option-item {
          display: flex;
          align-items: center;
          .icon {
            margin-right: 5px;
          }
        }
      }
      .add-option:first-child {
        padding-left: 0;
      }
    }
  }
}
</style>
