<template>
  <div class="option-edit-wrap">
    <draggable
      id="sortDraggable"
      :list="optionList"
      handle=".drag-handle"
      @update="optionSortChange"
      itemKey="hash"
    >
      <template #item="{ element, index }">
        <div class="draggdiv dragg-handle">
          <span class="drag-handle qicon qicon-tuodong"></span>
          <div class="input-box">
            <RichEditor
              :modelValue="element.text"
              @change="(value) => handleChange(index, value)"
              @created="handleCreated"
            />
          </div>

          <i-ep-circlePlus
            v-if="isShowOperation"
            class="opt-btn-icon"
            @click="onAddOption(index)"
          />
          <el-tooltip
            v-if="isShowOperation"
            class="icon delete"
            effect="dark"
            content="删除"
            placement="top"
          >
            <i-ep-remove @click="deleteOption(index)" class="opt-btn-icon delete" />
          </el-tooltip>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { cloneDeep as _cloneDeep } from 'lodash-es'
import RichEditor from '@/common/Editor/RichEditor.vue'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'OptionEdit',
  props: {
    optionList: {
      type: Array,
      default: () => []
    },
    isShowOperation: {
      type: Boolean,
      default: true
    }
  },
  components: {
    draggable,
    RichEditor
  },
  data() {
    return {
      // 编辑器创建完成数量
      createdEditorCount: 0,
      // 编辑器实例列表
      editorList: []
    }
  },
  mounted() {
    // 选项hash兜底
    const hashMap = {}
    let hashHasChanged = false
    for (const item of this.optionList) {
      if (!item.hash) {
        item.hash = this.getNewHash(hashMap)
        hashHasChanged = true
      }
    }
    const originOptionList = _cloneDeep(this.optionList)
    if (hashHasChanged) {
      this.$emit('optionChange', originOptionList)
    }
  },
  methods: {
    getRandom() {
      return Math.random().toString().slice(-6)
    },
    getNewHash(hashMap) {
      let random = this.getRandom()
      while (random in hashMap) {
        random = this.getRandom()
      }
      return random
    },
    handleChange(index, value) {
      // 更新单个选项文案
      const optionKey = `options[${index}].text`
      const key = `${optionKey}`
      this.$emit('change', { key, value })
    },
    onAddOption(index) {
      this.$emit('addOption', '选项', false, index)
    },
    async deleteOption(index) {
      const optionList = _cloneDeep(this.optionList)
      optionList.splice(index, 1)
      this.$emit('optionChange', optionList)
    },
    optionSortChange() {
      const optionList = _cloneDeep(this.optionList)
      this.$emit('optionChange', optionList)
    },
    // 监听 editor 创建完成
    handleCreated(editor) {
      this.createdEditorCount++
      this.editorList.push(editor)
    }
  },
  computed: {
    ...mapGetters({
      moduleConfig: 'edit/moduleConfig'
    }),
    // 当前题目所有编辑器是否创建完成
    createdAllCurrentEditQuestionEditor() {
      return this.createdEditorCount === this.moduleConfig?.options?.length
    }
  },
  watch: {
    // 监听当前编辑选项所有编辑器创建完成
    // 如果所有选项创建完成，则聚焦第一个选项
    createdAllCurrentEditQuestionEditor(bool) {
      if (bool) {
        this.editorList[0]?.focus()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.option-edit-wrap {
  #sortDraggable {
    user-select: none;
    padding-right: 0.08rem;
  }

  .draggdiv {
    display: block;
    cursor: move;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    border: 1px solid transparent;
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
    }

    &.dragg-handle {
      border: 1px solid transparent;

      .input-box {
        margin-left: 5px;
        background-color: #fff;
        border: 1px solid #e3e4e6;
        border-radius: 2px;
      }

      .opt-btn-icon {
        margin-right: 5px;
        color: #888;
        cursor: pointer;
      }
    }
  }
}
</style>
