<template>
  <Teleport to="body">
    <Transition>
      <div class="image-preview" v-show="visible">
        <div class="close-btn" @click="visible = false"><i-ep-close /></div>
        <div class="image-con">
          <img :src="props.url" class="image-item" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script setup lang="ts">
const props = defineProps<{
  url: string
}>()

const visible = defineModel('visible')
</script>
<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.image-preview {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba($color: #000000, $alpha: 0.4);
  z-index: 2024;
  display: flex;
  align-items: center;
  justify-content: center;

  .image-con {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .image-item {
      max-width: 80%;
      max-height: 70%;
    }
  }

  .close-btn {
    position: absolute;
    right: 20px;
    top: 20px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    background-color: #d0d0d0;
  }
}
</style>
