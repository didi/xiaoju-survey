<template>
  <div class="question-catalog-item" @click="onSelect()">
    <div class="iconfont icon-tuodong draggHandle"></div>
    <div class="catalog-item-body">
      <div class="catalog-item-index" v-if="showIndex">{{ indexNumber }}.</div>
      <div class="catalog-item-title" v-plain-text="title"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestionCatalogItem',
  data() {
    return {}
  },
  computed: {},
  props: {
    title: {
      type: String,
      default: '',
    },
    indexNumber: {
      type: [String, Number],
      default: '',
    },
    showIndex: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  methods: {
    onSelect() {
      this.$emit('select')
    },
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.question-catalog-item {
  position: relative;
  border-top: 1px solid #ebebeb;
  font-size: 12px;
  display: flex;
  align-items: center;
  color: #333333;
  cursor: pointer;

  &:last-child {
    border-bottom: 1px solid #ebebeb;
  }

  .iconfont {
    line-height: 36px;
    margin-right: 8px;
    color: $font-color;
  }

  .draggHandle {
    margin-top: 0;
    cursor: move;
  }

  .catalog-item-body {
    display: flex;

    .catalog-item-title {
      width: 230px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
