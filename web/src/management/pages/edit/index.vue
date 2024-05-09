<template>
  <div class="edit-index">
    <LeftMenu class="left"></LeftMenu>
    <div class="right">
      <CommonTemplate style="background-color: #f6f7f9">
        <template #nav>
          <Navbar class="navbar"></Navbar>
        </template>
        <template #body>
          <router-view></router-view>
        </template>
      </CommonTemplate>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'

import LeftMenu from '@/management/components/LeftMenu.vue'

import CommonTemplate from './components/CommonTemplate.vue'
import Navbar from './components/ModuleNavbar.vue'

export default {
  name: 'questionEditPage',
  components: {
    CommonTemplate,
    Navbar,
    LeftMenu
  },
  async created() {
    this.$store.commit('edit/setSurveyId', this.$route.params.id)
    try {
      await this.$store.dispatch('edit/init')
    } catch (error) {
      ElMessage.error(error.message)
      // 自动跳转回列表页
      setTimeout(() => {
        this.$router.replace({
          name: 'survey'
        })
      }, 1000)
    }
  }
}
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
