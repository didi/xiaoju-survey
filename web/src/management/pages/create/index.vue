<template>
  <div class="new">
    <type-list
      :selectType="selectType"
      @selectTypeChange="onSelectTypeChange"
    />
    <create-form :selectType="selectType" />
  </div>
</template>

<script>
import typeList from './components/typeList.vue'
import createForm from './components/createForm.vue'

export default {
  name: 'createPage',
  components: {
    typeList,
    createForm,
  },
  data() {
    return {
      selectType: 'normal',
    }
  },
  methods: {
    onSelectTypeChange(selectType) {
      this.selectType = selectType
    },
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.new {
  position: relative;
  min-height: 750px;
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #fff;
}
@media screen and (max-height: 800px) {
  #new {
    .new-title {
      margin-bottom: 33px;
    }
    .btn-wrap {
      margin-top: -10px;
    }
  }
}
</style>
