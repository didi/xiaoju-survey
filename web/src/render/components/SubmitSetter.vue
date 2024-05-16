<template>
  <div class="question-submit_wrapper">
    <button class="question-submit-btn" @click="handleSubmit">
      {{ submitConf.submitTitle }}
    </button>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

interface Props {
  validate: (fn: (valid: boolean) => void) => void
  renderData?: Array<any>
}

interface Emit {
  (ev: 'submit'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const store = useStore()

const submitConf = computed(() => store.state?.submitConf || {})

const handleSubmit = (e: Event) => {
  const validate = props.validate
  if (e) {
    e.preventDefault()
    validate((valid) => {
      if (valid) {
        emit('submit')
      }
    })
  }
}
</script>
<style lang="scss" scoped>
@import '@/render/styles/variable.scss';
.question-submit_wrapper {
  margin: 0 0.4rem;
  font-size: 0;
  position: relative;
  .question-submit-btn {
    position: relative;
    display: inline-block;
    width: 100%;
    padding: 0.25rem 0;
    font-size: 0.36rem;
    line-height: 0.5rem;
    font-weight: 500;
    text-align: center;
    color: #fff;
    background: var(--primary-color);
    border-radius: 0.08rem;
    margin: 0.4rem 0;
    cursor: pointer;
  }
}
</style>
