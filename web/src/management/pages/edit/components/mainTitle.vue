<template>
  <div class="title-wrapper" @click="handleClick()">
    <div class="main-title" :class="{ active: isSelected }" >
      <richEditor
        :value="bannerConf?.titleConfig?.mainTitle"
        @input="onTitleInput"
      ></richEditor>
    </div>
  </div>
</template>
<script>
import richEditor from '@/common/Editor/RichEditor';

export default {
  name: 'mainTitlePreview',
  data() {
    return {};
  },
  props: {
    preview: {
      type: Boolean,
      default: false,
    },
    bannerConf: {
      type: Object,
    },
    isSelected: {
      type: Boolean,
    },
  },
  computed: {},
  methods: {
    handleClick() {
      if(this.preview) {
        return false
      } else {
        this.$emit('select');
      }
    },
    onTitleInput(val) {
      if (!this.isSelected) {
        return;
      }
      this.$emit('change', {
        key: 'titleConfig.mainTitle',
        value: val,
      });
    },
  },
  components: {
    richEditor,
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.title-wrapper {
  padding: 15px;
}

.main-title {
  border: 1px solid transparent;

  &.active {
    border: 1px solid #e3e4e6;
    background-color: #f6f7f9;
    box-shadow: 0 0 5px #dedede;

    ::v-deep .w-e-text-container {
      background-color: #f6f7f9;
    }
  }
}

.main-title:hover {
  border: 1px dashed #eee;
}
</style>
