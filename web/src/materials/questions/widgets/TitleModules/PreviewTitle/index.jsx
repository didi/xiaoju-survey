import { defineComponent } from 'vue'

import TitleContent from '../TitleContent'

export default defineComponent({
  name: 'PreviewTitle',
  props: {
    indexNumber: {
      type: [Number, String],
      default: ''
    },
    showIndex: {
      type: Boolean,
      default: false
    },
    isRequired: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    showType: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    }
  },
  setup() {},
  render() {
    const { isRequired, indexNumber, title, showType, type, showIndex } = this

    return (
      <TitleContent
        isRequired={isRequired}
        indexNumber={indexNumber}
        title={title}
        showIndex={showIndex}
        showType={showType}
        type={type}
      />
    )
  }
})
