import { defineComponent, computed } from 'vue'
import './index.scss'
import { useStore } from 'vuex'

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
    const store = useStore()

    const logoImage = computed(() => {
      return props.logoConf?.logoImage
    })

    const logoImageWidth = computed(() => {
      return props.logoConf?.logoImageWidth
    })

    const isMobile = computed(() => {
      return store.state?.isMobile
    })

    const logoStyle = computed(() => {
      let style = {}
      if (!props.readonly) {
        style = {
          width: logoImageWidth.value
        }
      } else {
        style = {
          width: !isMobile.value ? '20%' : logoImageWidth.value || '20%'
        }
      }
      return style
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
      logoStyle,
      props,
      onSelect,
      noLogoRender
    }
  },
  render() {
    const { readonly } = this.props
    return (
      <div class="logo-icon-warp" onClick={this.onSelect}>
        <div class={[readonly ? 'logo-wrapper' : 'question-logo']}>
          {this.logoImage ? (
            <img src={this.logoImage} style={this.logoStyle} />
          ) : (
            this.noLogoRender()
          )}
        </div>
      </div>
    )
  }
})
