<script lang="jsx">
import { defineComponent, reactive, toRefs, watch } from 'vue'
import ElPopconfirm from './ElPopconfirm.vue'
import BatchAddPopover from './BatchAddPopover.vue'
const OptionSetting = defineComponent({
  name: 'OptionSetting',
  components: { ElPopconfirm },
  props: {
    level: {
      type: Number,
      default: 0
    },
    active: {
      type: Number,
      default: 0
    },
    levelOptions: {
      type: Array,
      default: () => []
    },
    addBtnShow: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const gethoverlist = (arr) => {
      return arr.map(() => {
        return false
      })
    }
    const state = reactive({
      formValue: { options: props.levelOptions },
      itemHover: gethoverlist(props.levelOptions),
      hoverable: true
    })
    watch(
      () => props.levelOptions,
      (value) => {
        ;(state.formValue.options = value), (state.itemHover = gethoverlist(value))
      },
      {
        immediate: true,
        deep: true
      }
    )
    const handleClick = (value) => {
      emit('change', value)
    }
    const handleEdit = (val) => {
      let newOptions = state.formValue.options
      newOptions[props.active].name = val.trim()
      emit('update', newOptions)
    }
    const addField = () => {
      emit('add', props.levelOptions.length)
    }
    const addBatchField = (value) => {
      // 每行代表一个选项；空行会被忽略；相同选项内容会被自动去重。
      let arr = value.split('\n')
      arr = arr.map(function (s) {
        return s && String(s).trim()
      })
      const options = [...new Set(arr)]
      emit('addBatch', options)
    }
    const handelDelete = (active) => {
      emit('delete', active)
    }
    const handleMouseEnter = (active) => {
      if (state.hoverable) {
        state.itemHover.splice(active, 1, true)
      }
    }
    const handleMouseLeave = (active) => {
      if (state.hoverable) {
        state.itemHover.splice(active, 1, false)
      }
    }
    const validateFieldFun = (rule, value, callback) => {
      const existValues = state.formValue.options
        .filter((item) => item.id !== rule.id)
        .map((item) => item.name)
      if (value === '') {
        callback(new Error('请输入选项内容!'))
      } else if (existValues.includes(value)) {
        callback(new Error('选项内容不可重复!'))
      } else {
        callback()
      }
    }
    return {
      ...toRefs(state),
      handleClick,
      handleEdit,
      addField,
      addBatchField,
      handelDelete,
      handleMouseEnter,
      handleMouseLeave,
      validateFieldFun
    }
  },
  render() {
    return (
      <div class="setting">
        <el-form ref={`FormLevel${this.level}`} model={this.formValue}>
          {this.formValue.options.map((item, index) => {
            return (
              <div
                class={['setting-item', this.active === index ? 'setting-item-active' : '']}
                onClick={() => this.handleClick(index)}
                onmouseenter={() => {
                  this.handleMouseEnter(index)
                }}
                onmouseleave={() => {
                  this.handleMouseLeave(index)
                }}
              >
                <el-form-item
                  prop={`options[${index}].name`}
                  key={item.id}
                  rules={[
                    {
                      validator: this.validateFieldFun,
                      trigger: ['blur', 'change'],
                      id: item.id
                    }
                  ]}
                >
                  <el-input
                    value={item.name}
                    onInput={(val) => {
                      this.handleEdit(val)
                    }}
                  >
                    {this.itemHover[index] ? (
                      // 有子级的话删除确认框，否则直接删除
                      item.children && item.children.length !== 0 ? (
                        <ElPopconfirm
                          slot="suffix"
                          title="你确定删除这个选项吗？"
                          desc="删除该选项，会将其关联的下级选项也删除；且删除后不可恢复，请谨慎操作。"
                          onConfirm={() => {
                            this.handelDelete(index)
                          }}
                          onCancel={() => {
                            this.handleMouseLeave(index)
                          }}
                          onShow={() => {
                            this.hoverable = false
                          }}
                          onHide={() => {
                            this.hoverable = true
                          }}
                        >
                          {
                            <i
                              class="el-input__icon el-icon-shanchu"
                              slot="reference"
                              style="cursor: pointer"
                            ></i>
                          }
                        </ElPopconfirm>
                      ) : (
                        <i
                          class="el-input__icon el-icon-shanchu"
                          slot="suffix"
                          style="cursor: pointer"
                          onClick={() => {
                            this.handelDelete(index)
                          }}
                        ></i>
                      )
                    ) : (
                      ''
                    )}
                  </el-input>
                </el-form-item>
              </div>
            )
          })}
          {this.addBtnShow && (
            <el-form-item class="setting-btn">
              <el-button
                link
                class="setting-btn-item"
                onClick={() => {
                  this.addField(this.level)
                }}
              >
                单个添加
              </el-button>
              <BatchAddPopover
                class="setting-btn-item"
                title="批量添加选项"
                desc="备注：每行代表一个选项；空行会被忽略；相同选项内容会被自动去重。"
                onConfirm={this.addBatchField}
              >
                <el-button link class="setting-btn-item" slot="reference">
                  批量添加
                </el-button>
              </BatchAddPopover>
            </el-form-item>
          )}
        </el-form>
      </div>
    )
  }
})

export default OptionSetting
</script>

<style lang="scss" scoped>
.setting {
  padding: 10px 0;

  &-item {
    padding: 0 6px;

    &-active {
      .el-input__inner {
        border-color: orange !important;
      }
    }
  }

  &-btn {
    > div {
      display: flex;
    }

    &-item {
      flex: 1;
      color: orange !important;
      text-align: center;
      height: 32px;
      line-height: 32px;
    }
  }
}
</style>
