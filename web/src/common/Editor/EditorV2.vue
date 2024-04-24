<template>
  <div class="editor-v2">
    <RichEditor :modelValue="realData" @input="handleChange" @blur="handleBlur" />
  </div>
</template>
<script>
import RichEditor from './RichEditor.vue'

export default {
  components: {
    RichEditor
    // ReadOnly,
  },
  props: {
    realData: {
      type: String,
      default: () => ''
    },
    questionDataList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  unmounted() {
    this.$emit('onDestroy')
  },
  methods: {
    handleChange(v) {
      this.$emit('change', v)
    },
    handleBlur(v) {
      this.$emit('blur', v)
    }
  }
}
</script>
<style lang="scss" scoped>
.editor-v2 {
  width: 100%;
  display: flex;
  .operation {
    display: flex;
    position: relative;
    left: 8px;
    top: 2px;
  }
}
.RichEditor {
  width: 95.5%;
  display: inline-block;
  margin-right: 3px;
  margin-left: -7px;
}
.icon {
  margin-left: 4px;
  font-size: 17px;
  color: #888;
  cursor: pointer;
}
.icon.delete:hover {
  color: red;
}
</style>
