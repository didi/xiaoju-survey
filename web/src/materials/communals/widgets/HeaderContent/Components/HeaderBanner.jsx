import { defineComponent, computed } from 'vue'
import { get as _get } from 'lodash-es'
import { formatLink } from '@materials/communals/common/utils'

export default defineComponent({
  name: 'HeaderContent',
  props: {
    bannerConf: {
      type: Object,
      default: () => {}
    },
    readonly: {
      type: Boolean,
      default: false
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const bgImage = computed(() => {
      return _get(props.bannerConf, 'bannerConfig.bgImage', '')
    })

    const onBannerClick = () => {
      const allow = _get(props.bannerConf, 'bannerConfig.bgImageAllowJump', false)
      const jumpLink = _get(props.bannerConf, 'bannerConfig.bgImageJumpLink', '')
      if (!allow || !jumpLink) {
        return
      }
      window.open(formatLink(jumpLink))
    }

    const bannerRender = () => {
      let attribute = {
        class: 'banner-img'
      }
      if (props.readonly) {
        const allow = _get(props.bannerConf, 'bannerConfig.bgImageAllowJump', false)
        attribute = {
          class: `${attribute.class}  ${allow ? 'pointer' : ''}`,
          onClick: onBannerClick
        }
      }
      if (bgImage.value) {
        return (
          <div class="banner">
            <img src={bgImage.value} {...attribute} />
          </div>
        )
      }
      if (!bgImage.value && !props.readonly) {
        let classStr = 'empty-banner'
        if (props.isSelected) {
          classStr += 'banner-active'
        }
        return (
          <div class={classStr}>
            <p>点击配置头图</p>
            <p>若不配置头图，将不在问卷中展示</p>
          </div>
        )
      }
      return ''
    }

    return {
      bgImage,
      // emptyBannerRender,
      bannerRender
    }
  },
  render() {
    return (
      <div class="header-banner-wrap">
        {this.bannerRender()}
        {/* {this.emptyBannerRender()} */}
      </div>
    )
  }
})
