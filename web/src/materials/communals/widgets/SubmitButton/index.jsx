import { defineComponent } from 'vue'
import '@/render/styles/variable.scss';
import './index.scss';

export default defineComponent({
  name: 'SubmitButton',
  props: {
    submitConf: Object,
    skinConf: {
      type: Object,
      required: true
    },
    readonly: Boolean,
    validate: Function,
    renderData: Array
  },
  emits: ['submit','select'],
  setup(props, { emit }) {
    
    const submit = (e) => {
      if (!props.readonly) return;
      const validate = props.validate
      if (e) {
        e.preventDefault()
        validate((valid) => {
          if (valid) {
            this.$emit('submit')
          }
        })
      }
    }

    const handleClick = () => {
      if (props.readonly) return;
      emit('select')
    }

    return {
      props,
      submit,
      handleClick
    }

  },
  render() {
    const { readonly,submitConf } = this.props;
    return (
      <div class={ ['submit-warp',readonly ? 'question-submit_wrapper' : 'preview-submit_wrapper']} onClick={ this.handleClick }>
        <el-button class="submit-btn" type="primary" onClick={this.submit}>{ submitConf.submitTitle }</el-button>
      </div>
    )
  }
})