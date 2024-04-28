<template>
  <div class="text-button-root" @click="onClick">
    <el-button v-bind="{ ...$attrs }">
      {{ option.label }}
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'TextButton',
  data() {
    return {
      iconIndex: 0
    }
  },
  props: {
    option: {
      type: Object,
      required: true
    },
    effectFun: {
      type: Function
    },
    effectKey: {
      type: String
    }
  },
  computed: {
    toggleOptionIcons() {
      return this.option.icons.slice(1)
    },
    iconsLength() {
      return this.toggleOptionIcons.length
    },
    currentIconItem() {
      let finalIconIndex = this.iconIndex % this.iconsLength
      return this.toggleOptionIcons[finalIconIndex]
    }
  },
  methods: {
    onClick() {
      this.iconIndex++
      if (this.iconIndex >= this.iconsLength) {
        this.iconIndex = 0
      }
      typeof this.effectFun === 'function' &&
        this.effectFun(this.currentIconItem.effectValue, this.effectKey)
    }
  },
  created() {
    this.iconIndex = this.toggleOptionIcons.findIndex((iconItem) => iconItem.isDefaultValue)
  }
}
</script>

<style lang="scss" scoped>
.text-button-root {
  display: flex;
  align-items: center;
}
.el-button {
  margin-right: 20px;
  font-size: 14px;
  color: #4a4c5b;
}
</style>
