<template>
  <div class="main">
    <template v-for="(item, index) in renderData">
      <div :key="index">
        <materialGroup
          ref="formGroup"
          :render-data="item"
          :rules="rules"
          :formModel="formModel"
          @change="changeData"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import materialGroup from './materialGroup';
export default {
  name: 'mainRenderer',
  computed: {
    // ...mapState('questionData'),
    questionData() {
      return this.$store.state.questionData;
    },
    renderData() {
      return this.$store.getters.renderData;
    },
    rules() {
      return this.$store.state.rules;
    },
    formModel() {
      return this.$store.getters.formModel;
    },
  },
  mounted() {},
  components: { materialGroup },
  methods: {
    ...mapActions(['changeData']),
  },
};
</script>

<style scoped lang="scss"></style>
