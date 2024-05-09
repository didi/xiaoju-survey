<template>
  <div class="main">
    <template v-for="(item, index) in renderData" :key="index">
      <MaterialGroup
        ref="formGroup"
        :render-data="item"
        :rules="rules"
        :formModel="formModel"
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
    formModel() {
      return this.$store.getters.formModel
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
