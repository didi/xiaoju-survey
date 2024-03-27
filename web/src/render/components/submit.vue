<template>
  <div class="question-submit_wrapper">
    <button
      class="question-submit-btn"
      @click="submit"
    >
      {{ submitConf.submitTitle }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'submit',
  props: {
    validate: Function,
    renderData: Array,
  },
  data() {
    return {};
  },
  computed: {
    submitConf() {
      return this.$store.state?.submitConf || {};
    },
    skinConf() {
      return this.$store.state?.skinConf || {};
    },
  },
  methods: {
    submit(e) {
      const validate = this.validate;
      if (e) {
        e.preventDefault();
        validate((valid) => {
          if (valid) {
            this.$emit('submit');
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
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
