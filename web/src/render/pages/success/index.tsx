import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

import LogoIcon from '../../components/LogoIcon.vue'
import './style.scss'

export default defineComponent({
  name: 'successPage',
  components: {
    LogoIcon,
  },
  setup() {
    const store = useStore()

    const successMsg = computed(() => {
      const msgContent = store.state?.submitConf || {}
      return msgContent?.msg_200 || '提交成功'
    })

    return {
      successMsg
    }
  },
  render() {
    const { successMsg } = this

    return (
      <div class="success-page-wrap">
        <div class="result-page">
          <div class="result-content">
            <img src="/imgs/icons/success.webp" />
            <div class="msg">{successMsg}</div>
          </div>
          <LogoIcon />
        </div>
      </div>
    )
  }
})