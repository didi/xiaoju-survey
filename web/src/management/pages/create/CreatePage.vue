<template>
  <div class="new">
    <TypeList :selectType="selectType" @selectTypeChange="onSelectTypeChange" />
    <CreateForm :selectType="selectType" />
  </div>
</template>

<script>
import TypeList from './components/TypeList.vue'
import CreateForm from './components/CreateForm.vue'

export default {
  name: 'CreatePage',
  components: {
    TypeList,
    CreateForm
  },
  data() {
    return {
      selectType: 'normal'
    }
  },
  methods: {
    onSelectTypeChange(selectType) {
      this.selectType = selectType
    }
  }
}
</script>

<style lang="scss" scoped>
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
