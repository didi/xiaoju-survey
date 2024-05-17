import { defineComponent,computed } from 'vue'
import RichEditor from '@/common/Editor/RichEditor.vue'
import '@/render/styles/variable.scss';
import './index.scss';

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

    const titleClass = computed(() => {
      let classStr = '';
      if (props.readonly) {
        classStr = `main-title ${props.isSelected ? 'active' : ''}`;
      } else {
        classStr = 'titlePanel';
        
      }
      return classStr
    });

    const isTitleHide = computed(() => { 
      if (!props.readonly && !mainTitle.value) {
        return false
      }
      return true;
    })

    const mainTitle = computed(() => { 
      return props.bannerConf.titleConfig?.mainTitle
    })

    const handleClick = () => {
      if (!props.readonly) return;
      emit('select')
    }

    const onTitleInput = (val) => {
      if (!props.isSelected) {
        return
      }
      emit('change', {
        key: 'titleConfig.mainTitle',
        value: val
      })
    }

    return {
      props,
      titleClass,
      isTitleHide,
      mainTitle,
      handleClick,
      onTitleInput,
    }
  },
  render() {
    return (
      <div class={['main-title-warp', this.props.readonly ? 'pd15' : '']} onClick={this.handleClick}>
        {this.isTitleHide ? 
          <div class={this.titleClass}>
            {this.props.readonly ?
              <RichEditor 
                modelValue={this.mainTitle}
                onInput={this.onTitleInput}
                placeholder="请输入标题"
              />
            :
              <div class="main-title" v-html={this.mainTitle}></div>
            }
          </div>
        :
        ''}
      </div>
    )
  }
})