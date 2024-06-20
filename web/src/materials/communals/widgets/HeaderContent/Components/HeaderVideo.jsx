import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'HeaderVideo',
  props: {
    bannerConf: {
      type: Object,
      default: () => {}
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const attributeVideo = computed(() => {
      const { bannerConf, readonly } = props
      let data = {
        id: 'video',
        preload: 'auto',
        style: readonly ? 'margin: 0 auto; width: 100%; display: block;' : '',
        poster: bannerConf?.bannerConfig?.postImg,
        controls: '',
        class: readonly ? '' : 'custom-video'
      }
      return data
    })

    const play = () => {
      const video = document.getElementById('video')
      if (!video) return
      document.querySelector('.play-icon').style.display = 'none'
      document.querySelector('.video-modal').style.display = 'none'
      video.play()
    }

    return {
      attributeVideo,
      props,
      play
    }
  },
  render() {
    const { readonly } = this.props
    return (
      <div class="header-video-warp">
        <div class="video">
          <video {...this.attributeVideo}>
            <source src={this.bannerConf?.bannerConfig?.videoLink} type="video/mp4" />
          </video>
          {readonly ? (
            <>
              <div
                class="video-modal"
                style={`background-image:url(${this.attributeVideo.poster})`}
              ></div>
              <div class="iconfont icon-kaishi play-icon" onClick={this.play}></div>
            </>
          ) : (
            ''
          )}
        </div>
      </div>
    )
  }
})
