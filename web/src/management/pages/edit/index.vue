<template>
  <div class="edit-index">
    <leftMenu class="left"></leftMenu>
    <div class="right">
      <commonTemplate style="background-color: #f6f7f9">
        <navbar class="navbar" slot="nav"></navbar>
        <router-view slot="body"></router-view>
      </commonTemplate>
    </div>
  </div>
</template>

<script>
import commonTemplate from './components/commonTemplate.vue';
import navbar from './components/navbar.vue';
import leftMenu from '@/management/components/leftMenu.vue';
export default {
  name: 'questionEditPage',
  components: {
    commonTemplate,
    navbar,
    leftMenu,
  },
  async created() {
    this.$store.commit('edit/setSurveyId', this.$route.params.id);
    try {
      await this.$store.dispatch('edit/init');
    } catch (error) {
      this.$message.error(error.message);
      // 自动跳转回列表页
      setTimeout(() => {
        this.$router.replace({
          name: 'survey',
        });
      }, 1000);
    }
  },
};
</script>
<style lang="scss" scoped>
.edit-index {
  height: 100%;
  width: 100%;
  overflow: hidden;

  .left {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
  }

  .right {
    min-width: 1160px;
    height: 100%;
    padding-left: 80px;
    overflow: hidden;
  }
  .navbar {
    border-bottom: 1px solid #e7e9eb;
  }
}
</style>
