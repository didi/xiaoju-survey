<template>
  <div class="main">
    <div class="nav" v-if="slots.nav">
      <slot name="nav"></slot>
    </div>
    <div class="body">
      <slot v-if="slots.body" name="body"></slot>
      <template v-else>
        <div class="left" v-if="slots.left">
          <slot name="left"></slot>
        </div>
        <div class="center" v-if="slots.center">
          <slot name="center"></slot>
        </div>
        <div class="right" v-if="slots.right">
          <slot name="right"></slot>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useSlots } from 'vue'

const slots = useSlots()
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .nav {
    flex-basis: 56px;
  }

  .body {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: row;
    overflow: hidden;

    .left,
    .center,
    .right {
      height: 100%;
    }

    .left,
    .right {
      flex-grow: 0;
      flex-shrink: 0;
    }

    .center {
      flex: 1;
    }
  }
}
</style>
