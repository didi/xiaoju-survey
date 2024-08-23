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
import { useEditStore } from '@/management/stores/edit'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'

import LeftMenu from '@/management/components/LeftMenu.vue'
import CommonTemplate from './components/CommonTemplate.vue'
import Navbar from './components/ModuleNavbar.vue'
import axios from '../../api/base'
import { initShowLogicEngine } from '@/management/hooks/useShowLogicEngine'


const editStore = useEditStore()
const { init, setSurveyId } = editStore

const router = useRouter()
const route = useRoute()
const authCheckInterval = ref<any>(null)
const showConfirmBox = () => {
  ElMessageBox.alert('登录状态已失效，请重新登陆。', '提示', {
    confirmButtonText: '确认',
    showClose: false,
    callback: (action: Action) => {
      if (action === 'confirm') {
        axios.get('/auth/statuscheck')
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
            store.dispatch('user/logout').then(() => {
              router.replace({name: 'login'});
            })
          });
        }
    }
  });
}
const checkAuth = () => {
  axios.get('/auth/statuscheck').then((response) => {
    if (response.data.expired) {
      clearInterval(authCheckInterval.value);
      authCheckInterval.value = null
      showConfirmBox();
    }
  }).catch((error) => {
    console.log("erro:" + error)
  });
}
onMounted(async () => {
  setSurveyId(route.params.id as string)

  try {
    await init()
    // 启动定时器，每30分钟调用一次
    authCheckInterval.value = setInterval(() => checkAuth(), 1000);
  } catch (err: any) {
    ElMessage.error(err.message)

    setTimeout(() => {
      router.replace({ name: 'survey' })
    }, 1000)
  }
})
onUnmounted(() => {
  clearInterval(authCheckInterval.value);
  authCheckInterval.value = null
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
    min-width: 1300px;
    height: 100%;
    padding-left: 80px;
    overflow: hidden;
  }

  .navbar {
    border-bottom: 1px solid #e7e9eb;
  }
}
</style>
