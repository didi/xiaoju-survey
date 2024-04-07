<script>
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
  getCurrentInstance,
} from 'vue';

export default defineComponent({
  name: 'QuestionWrapper',
  props: {
    qIndex: {
      type: Number,
      default: 0,
    },
    indexNumber: {
      type: Number,
      default: 1,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
    isLast: {
      type: Boolean,
      default: false,
    },
    moduleConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      isHover: false,
    });
    const { proxy } = getCurrentInstance();
    const itemClass = computed(() => {
      return {
        'question-wrapper': true,
        'mouse-hover': state.isHover,
        isSelected: props.isSelected,
        spliter: props.moduleConfig.showSpliter,
      };
    });
    const showHover = computed(() => {
      return state.isHover;
    });
    const showUp = computed(() => {
      return props.qIndex !== 0;
    });
    const showDown = computed(() => {
      return !props.isLast;
    });
    const showCopy = computed(() => {
      const field = props.moduleConfig.field;
      const hiddenCopFields = ['mob', 'mobileHidden', 'userAgreement'];
      return hiddenCopFields.indexOf(field) <= -1;
    });
    const toggleHoverClass = (status) => {
      state.isHover = status;
    };
    const clickFormItem = () => {
      const index = props.qIndex;
      emit('select', index);
    };
    const onCopy = () => {
      const index = props.qIndex;
      // this.changeQuestionSeq({ type: 'copy', index })
      emit('changeSeq', { type: 'copy', index });
      state.isHover = false;
    };
    const onMoveUp = () => {
      const index = props.qIndex;
      // this.changeQuestionSeq({ type: 'move', index, range: -1 })
      emit('changeSeq', { type: 'move', index, range: -1 });
      state.isHover = false;
    };
    // const onMoveTop = () => {
    //   const index = props.qIndex
    //   // this.changeQuestionSeq({ type: 'move', index, range: -index })
    //   emit('changeSeq', { type: 'move', index, range: -index })
    //   state.isHover = false
    // }
    const onMoveDown = () => {
      const index = props.qIndex;
      // this.changeQuestionSeq({ type: 'move', index, range: 1 })
      emit('changeSeq', { type: 'move', index, range: 1 });
      state.isHover = false;
    };
    const onDelete = async () => {
      try {
        await proxy.$confirm(
          '本次操作会影响数据统计查看，是否确认删除？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        );
        const index = props.qIndex;
        // this.changeQuestionSeq({ type: 'move', index, range: 1 })
        emit('changeSeq', { type: 'delete', index });
        state.isHover = false;
      } catch (error) {
        console.log('取消删除');
      }
    };
    // const onMoveBottom = () => {
    //   const index = props.qIndex
    //   this.changeQuestionSeq({
    //     type: 'move',
    //     index,
    //     range: props.questionDataList.length - index,
    //   })
    //   state.isHover = false
    // }
    return {
      ...toRefs(state),
      itemClass,
      showHover,
      showUp,
      showDown,
      showCopy,
      onCopy,
      onMoveUp,
      onMoveDown,
      onDelete,
      toggleHoverClass,
      clickFormItem,
    };
  },
  render() {
    const { showHover, itemClass, showUp, showDown, showCopy } = this;
    return (
      <div
        class={itemClass}
        onMouseenter={() => {
          this.isHover = true;
        }}
        onMouseleave={() => {
          this.isHover = false;
        }}
        onClick={this.clickFormItem}
      >
        {this.moduleConfig.type !== 'section' && (
          <div>{this.$slots.default}</div>
        )}
        {
          <div class={[showHover ? 'visibily' : 'hidden', 'hoverItem']}>
            <div
              class="item move el-icon-rank"
              vOn:click_stop_prevent={this.onMove}
            ></div>
            {showUp && (
              <div
                class="item iconfont icon-shangyi"
                vOn:click_stop_prevent={this.onMoveUp}
              ></div>
            )}
            {showDown && (
              <div
                class="item iconfont icon-xiayi"
                vOn:click_stop_prevent={this.onMoveDown}
              ></div>
            )}
            {showCopy && (
              <div
                class="item copy iconfont icon-fuzhi"
                vOn:click_stop_prevent={this.onCopy}
              ></div>
            )}
            <div
              class="item iconfont icon-shanchu"
              vOn:click_stop_prevent={this.onDelete}
            ></div>
          </div>
        }
      </div>
    );
  },
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.question-wrapper {
  position: relative;
  padding: 0.36rem 0 0.36rem;
  border: 1px solid transparent;
  &.spliter {
    border-bottom: 0.12rem solid $spliter-color;
  }
  &:last-child{
    border: none;
  }
  .editor {
    display: flex;
    font-size: 0.32rem;
    margin-bottom: 0.4rem;
    padding: 0 0.4rem;
    .icon-required {
      color: $error-color;
      position: absolute;
      left: 0.16rem;
      font-size: 0.46rem;
    }
    .index {
      flex-shrink: 0;
    }
  }
  .component-wrapper {
    padding: 0 0.4rem;
    .editor {
      padding-left: 0.4rem;
    }
  }

  &.no-padding {
    .component-wrapper {
      padding: 0;
    }
  }

  &.mouse-hover {
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.09);
  }
  &.isSelected {
    background-color: #f2f4f7;
    box-shadow: 0 0 5px #e3e4e8;
  }

  .clear {
    clear: both;
  }

  &.question-type-section {
    .module-title {
      padding-bottom: 0;
    }
  }
  &.horizon {
    display: flex;
    .module-title .m-title {
      width: 1.2rem;
      margin-right: 8px;
      text-align: justify;
      position: relative;
      &::before {
        content: ':';
        display: block;
        position: absolute;
        right: -5px;
      }
      &::after {
        content: '';
        display: inline-block;
        width: 100%;
      }
    }
    .component-wrapper {
      flex: 1;
    }
  }
  .hoverItem {
    position: absolute;
    top: 0;
    margin-top: -5px;
    right: -32px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    &.hidden {
      display: none;
    }
    .item {
      margin-top: 5px;
      display: inline-block;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #eceff1;
      margin-right: 2px;
      cursor: pointer;
      color: #506b7b;
      font-size: 12px;
      text-align: center;
      line-height: 28px;
      &:hover {
        background-color: $primary-color;
        color: #fff;
      }
    }
    .move {
      cursor: move;
      font-size: 14px;
    }
    .copy {
      font-size: 14px;
    }
  }
  .titleGray {
    color: #ddd;
  }
  .relation-show,
  .jumpto-show,
  .listenmerge-show {
    margin-top: 0.4rem;
    font-size: 12px;
    color: $placeholder-color;
    padding: 0 0.4rem;
  }
  .relyList {
    white-space: pre-wrap;
  }
  .font-bold {
    font-weight: 500;
  }
  .option-origin-text {
    color: #ccc;
    margin-left: 17px;
  }
  .sort-tip {
    font-size: 0.26rem;
    line-height: 0.26rem;
    opacity: 0.5;
    margin-top: -0.24rem;
    margin-bottom: 0.4rem;
    padding-left: 0.4rem;
    color: #92949d;
  }
}
</style>
