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
<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'

import LeftMenu from '@/management/components/LeftMenu.vue'
import CommonTemplate from './components/CommonTemplate.vue'
import Navbar from './components/ModuleNavbar.vue'
import axios from '../../api/base'
import { initShowLogicEngine } from '@/management/hooks/useShowLogicEngine'

const store = useStore()
const router = useRouter()
const route = useRoute()
const authCheckInterval = ref<any>(null)
const showConfirmBox = () => {
  const token = store.state.user.userInfo.token
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
          store.dispatch('user/logout').then(() => {
            router.replace({name: 'login'});  // 仍然失效，登出，跳转到登录界面
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
}
const checkAuth = () => {
  const token = store.state.user.userInfo.token
  axios.get('/auth/statuscheck', {
    headers: {
    'Authorization': `Bearer ${token}`
    }
  }).then((response) => {
    if (response.data.expired) {
      showConfirmBox();
    }
  }).catch((error) => {
    console.log("erro:" + error)
    ElMessage.error(err)
  });
}
onMounted(async () => {
  store.commit('edit/setSurveyId', route.params.id)

  try {
    await store.dispatch('edit/init')
    await initShowLogicEngine(store.state.edit.schema.logicConf.showLogicConf || {})
  } catch (err: any) {
    ElMessage.error(err.message)

    setTimeout(() => {
      router.replace({ name: 'survey' })
    }, 1000)
  }
  // 启动定时器，每30分钟调用一次
  authCheckInterval.value = setInterval(() => {
    checkAuth()
  }, 30 * 60 * 1000);
})
onUnmounted(() => {
  clearInterval(authCheckInterval.value);
})
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
