import { defineComponent, computed } from 'vue'
import './index.scss'

export default defineComponent({
  name: 'LogoIcon',
  props: {
    logoConf: {
      type: Object,
      default: () => ({
        logoImageWidth: Number,
        logoImage: String
      })
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  emits: ['select'],
  setup(props, { emit }) {
    const logoImage = computed(() => {
      return props.logoConf?.logoImage
    })

    const logoImageWidth = computed(() => {
      return props.logoConf?.logoImageWidth
    })

    const onSelect = () => {
      if (props.readonly) return
      emit('select')
    }

    const noLogoRender = () => {
      if (!props.readonly) {
        return (
          <div class="logo-placeholder-wrapper">
            <div class="logo-placeholder">LOGO</div>
            <div class="no-logo-tip">若不配置logo，该图片将不会在问卷中展示</div>
          </div>
        )
      }
    }

    return {
      logoImage,
      logoImageWidth,
      props,
      onSelect,
      noLogoRender
    }
  },
  render() {
    return (
      <div class="logo-icon-warp" onClick={this.onSelect}>
        <div class="question-logo">
          {this.logoImage ? (
            <img src={this.logoImage} style={{ width: this.logoImageWidth }} />
          ) : (
            this.noLogoRender()
          )}
        </div>
      </div>
    )
  }
})
