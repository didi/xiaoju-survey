import { defineComponent, ref, computed } from 'vue';
import { filterXSS } from '@/common/xss';
import '../../common/css/title.scss';
import tagList from '../../common/config/tagList';

export default defineComponent({
  name: 'TitleModule',
  props: {
    showIndex: {
      type: Boolean,
      default: false,
    },
    indexNumber: {
      type: [Number, String],
      default: '',
    },
    isRequired: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: '标题',
    },
    showType: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const status = ref('');
    const typeName = computed(() => {
      if (!props.showType) return '';
      const types = props.showType ? [props.type] : [];
      if (!types || !types.length) return '';
      let ret = '';
      types.forEach((t) => {
        if (ret) return;
        const tv = tagList && tagList[t];
        if (tv && typeof tv === 'string') {
          ret = tv.trim();
        }
      });
      return ret;
    });
    const tagTitle = computed(() => {
      let htmlText = '';
      htmlText += filterXSS(props.title);
      htmlText = `<span>${htmlText}</span>`;
      if (typeName.value) {
        const index = htmlText.lastIndexOf('</p>');
        if (index > -1) {
          htmlText =
            htmlText.slice(0, index) +
            `<span class="m-tag">${typeName.value}</span>` +
            htmlText.slice(index);
        } else {
          htmlText = htmlText + `<span class="m-tag">${typeName.value}</span>`;
        }
      }
      return htmlText;
    });
    return {
      status,
      typeName,
      tagTitle,
    };
  },
  render() {
    const { isRequired, tagTitle, indexNumber } = this;
    return (
      <div class={['module-title', isRequired ? 'is-required' : '']}>
        <div>
          {isRequired && <i class="module-title-required">*</i>}
          <div class="module-title-title">
            {this.showIndex && <span class="index"> {indexNumber}.</span>}
            <div
              domPropsInnerHTML={filterXSS(tagTitle)}
              class="flex module-title-title-text"
            ></div>
          </div>
        </div>
      </div>
    );
  },
});
