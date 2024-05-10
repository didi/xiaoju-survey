<template>
  <div class="main">
    <template v-for="(item, index) in renderData" :key="index">
      <MaterialGroup
        ref="formGroup"
        :render-data="item"
        :rules="rules"
        :formValues="formValues"
        @formChange="changeData"
      />
    </template>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import MaterialGroup from './MaterialGroup.vue'
export default {
  name: 'MainRenderer',
  computed: {
    questionData() {
      return this.$store.state.questionData
    },
    renderData() {
      return this.$store.getters.renderData
    },
    rules() {
      return this.$store.state.rules
    },
    formValues() {
      return this.$store.state.formValues
    }
  },
  mounted() {},
  components: { MaterialGroup },
  methods: {
    ...mapActions(['changeData'])
  }
}
</script>

<style scoped lang="scss"></style>
