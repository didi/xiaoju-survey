import { defineComponent } from 'vue'
import '@/render/styles/variable.scss'
import './index.scss'

export default defineComponent({
  name: 'SubmitButton',
  props: {
    submitConf: Object,
    skinConf: {
      type: Object,
      default: () => ({})
    },
    isFinallyPage: Boolean,
    readonly: Boolean,
    validate: Function,
    renderData: Array
  },
  emits: ['submit', 'select'],
  setup(props, { emit }) {
    const submit = (e) => {
      if (!props.readonly) return
      const validate = props.validate
      if (e) {
        e.preventDefault()
        validate((valid) => {
          if (valid) {
            emit('submit')
          }
        })
      }
    }

    const handleClick = () => {
      if (props.readonly) return
      emit('select')
    }

    return {
      props,
      submit,
      handleClick
    }
  },
  render() {
    const { submitConf, isFinallyPage } = this.props
    return (
      <div class={['submit-warp', 'preview-submit_wrapper']} onClick={this.handleClick}>
        <button class="submit-btn" type="primary" onClick={this.submit}>
          {isFinallyPage ? submitConf.submitTitle : '下一页'}
        </button>
      </div>
    )
  }
})
