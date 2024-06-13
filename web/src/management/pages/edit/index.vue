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
import { ElMessage, ElMessageBox } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'

import LeftMenu from '@/management/components/LeftMenu.vue'

import CommonTemplate from './components/CommonTemplate.vue'
import Navbar from './components/ModuleNavbar.vue'
import { initShowLogicEngine } from '@/management/hooks/useShowLogicEngine'

import axios from '../../api/base'

export default {
  name: 'questionEditPage',
  components: {
    CommonTemplate,
    Navbar,
    LeftMenu
  },

  methods: {
    /**检测到登录失效时
     * 弹出弹窗 */
     showConfirmBox() {
      const token = this.$store.state.user.userInfo.token
      ElMessageBox.alert('登录状态已失效，请刷新同步。页面将展示最新保存的内容。', '提示', {
        confirmButtonText: '确认',
        callback: () => {
          axios.get('/auth/statuscheck', {
            headers: {
            'Authorization': `Bearer ${token}`
            }
          })
            .then((response) => {
              if (response.data.expired) {
                this.$store.dispatch('user/logout').then(() => {
                  this.$router.replace({name: 'login'});  // 仍然失效，登出，跳转到登录界面
                })
              } else {
                location.reload(); // 已登录，刷新页面
              }
            })
            .catch((error) => {
              console.log("error: " + error);
              ElMessage.error(error.message || '请求失败');
            });
        }
      });
    },

    checkAuth() {
      const token = this.$store.state.user.userInfo.token
      axios.get('/auth/statuscheck', {
        headers: {
        'Authorization': `Bearer ${token}`
        }
      }).then((response) => {
        if (response.data.expired) {
          this.showConfirmBox();
        }
      }).catch((error) => {
        console.log("erro:" + error)
        this.$message.error(error)
      });
    } 
  },

  async created() {
    this.$store.commit('edit/setSurveyId', this.$route.params.id)
    try {
      await this.$store.dispatch('edit/init')
      // await this.$store.dispatch('logic/initShowLogic', this.$store.state.edit.schema.logicConf.showLogicConf || {})
      await initShowLogicEngine(this.$store.state.edit.schema.logicConf.showLogicConf || {})
    } catch (error) {
      ElMessage.error(error.message)
      // 自动跳转回列表页
      setTimeout(() => {
        this.$router.replace({
          name: 'survey'
        })
      }, 1000)
    }
    // 启动定时器，每30分钟调用一次
    this.authCheckInterval = setInterval(() => {
      this.checkAuth()
    }, 30 * 60 * 1000);

  },

  beforeRouteLeave(to, from, next) {
    clearInterval(this.authCheckInterval);
    next();
  },  // 路由和组件摧毁时取消定时器

  beforeDestroy() {
    clearInterval(this.authCheckInterval);
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
