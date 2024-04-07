<template>
  <div class="title-wrapper" @click="handleClick()">
    <div class="main-title" :class="{ active: isSelected }">
      <richEditor
        :modelValue="bannerConf?.titleConfig?.mainTitle"
        @input="onTitleInput"
      ></richEditor>
    </div>
  </div>
</template>

<script>
import richEditor from '@/common/Editor/RichEditor.vue'

export default {
  name: 'mainTitlePreview',
  data() {
    return {}
  },
  props: {
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
      this.$emit('select')
    },
    onTitleInput(val) {
      if (!this.isSelected) {
        return
      }
      this.$emit('change', {
        key: 'titleConfig.mainTitle',
        value: val,
      })
    },
  },
  components: {
    richEditor,
  },
}
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

    :deep(.w-e-text-container) {
      background-color: #f6f7f9;
    }
  }
}

.main-title:hover {
  border: 1px dashed #eee;
}
</style>
