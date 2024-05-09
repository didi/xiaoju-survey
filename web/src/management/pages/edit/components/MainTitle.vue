<template>
  <div class="title-wrapper" @click="handleClick()">
    <div class="main-title" :class="{ active: isSelected }">
      <RichEditor
        :modelValue="bannerConf?.titleConfig?.mainTitle"
        @input="onTitleInput"
      ></RichEditor>
    </div>
  </div>
</template>

<script>
import RichEditor from '@/common/Editor/RichEditor.vue'

export default {
  name: 'mainTitlePreview',
  data() {
    return {}
  },
  props: {
    preview: {
      type: Boolean,
      default: false
    },
    bannerConf: {
      type: Object
    },
    isSelected: {
      type: Boolean
    }
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
        value: val
      })
    }
  },
  components: {
    RichEditor
  }
}
</script>

<style lang="scss" scoped>
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
