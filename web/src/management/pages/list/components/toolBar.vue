<template>
  <div class="tool-bar-root">
    <template v-if="tools.length">
      <tool
        v-for="t in tools"
        :key="t.key"
        :type="type"
        :value="t.key"
        :label="t.label"
        :width="toolWidth"
        @call="onCall"
      />
    </template>
  </div>
</template>

<script>
import { QOP_MAP } from '@/management/utils/constant';
import Tool from './tool';

export default {
  name: 'ToolBar',
  props: {
    data: Object,
    type: String,
    toolWidth: Number,
    tools: Array,
  },
  data() {
    return {};
  },
  methods: {
    onCall(val) {
      switch (val.key) {
        case QOP_MAP.EDIT:
          this.$emit('on-modify', this.data, QOP_MAP.EDIT);
          return;
        case QOP_MAP.COPY:
          this.$emit('on-modify', this.data, QOP_MAP.COPY);
          return;
        case 'analysis':
          this.$router.push({
            name: 'analysisPage',
            params: {
              id: this.data._id,
            },
          });
          return;
        case 'release':
          this.$router.push({
            name: 'publishResultPage',
            params: {
              id: this.data._id,
            },
          });
          return;
        case 'delete':
          this.$emit('on-delete', this.data);
          return;
        default:
          return;
      }
    },
  },
  components: {
    Tool,
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.tool-bar-root {
  margin-left: -16px;
  .tool-root:not(:last-child) {
    border-right: solid 1px $border-color;
  }
}
</style>
