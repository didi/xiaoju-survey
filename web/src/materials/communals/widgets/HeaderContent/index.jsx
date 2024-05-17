import { defineComponent } from 'vue'
import './index.scss';
import HeaderBanner from './Components/HeaderBanner';
import HeaderVideo from './Components/HeaderVideo';

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
  emits:['select'],
  setup(props, { emit }) { 
    const handleClick = () => {
      if (!props.readonly) return;
      emit('select')
    }

    return {
      handleClick,
      props
    }
  },
  render() {
    const bannerConf = this.props.bannerConf;
    return (
      <div class="header-content-warp" onClick={this.handleClick}>
        <HeaderBanner {...this.props} />
        {bannerConf?.bannerConfig?.videoLink ? <HeaderVideo {...this.props}/> : ''}
      </div>
    )
  }
})