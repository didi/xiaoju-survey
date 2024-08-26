<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { get as _get } from 'lodash-es'
import { useUserStore } from '@/management/stores/user'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage, type Action } from 'element-plus'

// 这里不需要自动跳转登录页面，所以单独引入axios
import axios from 'axios'

const userStore = useUserStore()
const router = useRouter()

let timer: any

const showConfirmBox = () => {
  ElMessageBox.alert('登录状态已失效，请重新登陆。', '提示', {
    confirmButtonText: '确认',
    showClose: false,
    callback: (action: Action) => {
      if (action === 'confirm') {
        userStore.logout();
        router.replace({ name: 'login' });
      }
    }
  });
}

const checkAuth = async () => {
  try {
    const token = _get(userStore, 'userInfo.token')

    const res = await axios({
      url: '/api/user/getUserInfo',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (res.data.code !== 200) {
      showConfirmBox();
    } else {
      timer = setTimeout(() => {
        checkAuth()
      }, 30 * 60 * 1000);
    }
  } catch (error) {
    const e = error as any
    ElMessage.error(e.message)
  }
  
}

watch(() => userStore.hasLogined, (hasLogined) => {
  if (hasLogined) {
    timer = setTimeout(() => {
      checkAuth()
    }, 30 * 60 * 1000);
  } else {
    clearTimeout(timer);
  }
})




</script>

<style lang="scss">
@import url('./styles/icon.scss');
@import url('../materials/questions/common/css/icon.scss');
@import url('./styles/reset.scss');
@import url('./styles/common.scss');

html {
  font-size: 50px;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  // font-size: 14px;
}

*,
a:hover * {
  text-decoration: none;
}
</style>
