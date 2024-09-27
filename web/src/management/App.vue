<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue'
import { useUserStore } from '@/management/stores/user'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage, type Action } from 'element-plus'
import { checkIsTokenValid } from '@/management/api/auth'

const userStore = useUserStore()
const router = useRouter()

let timer: any

const showConfirmBox = () => {
  ElMessageBox.alert('登录状态已失效，请重新登录。', '提示', {
    confirmButtonText: '确认',
    showClose: false,
    callback: (action: Action) => {
      if (action === 'confirm') {
        userStore.logout()
        router.replace({ name: 'login' })
      }
    }
  })
}

const checkAuth = async () => {
  try {
    const res: Record<string, any> = await checkIsTokenValid()
    if (res.code !== 200 || !res.data) {
      showConfirmBox()
    } else {
      timer = setTimeout(
        () => {
          checkAuth()
        },
        30 * 60 * 1000
      )
    }
  } catch (error) {
    const e = error as any
    ElMessage.error(e.message)
  }
}

watch(
  () => userStore.hasLogin,
  (hasLogin) => {
    if (hasLogin) {
      timer = setTimeout(
        () => {
          checkAuth()
        },
        30 * 60 * 1000
      )
    } else {
      clearTimeout(timer)
    }
  }
)

onBeforeUnmount(() => {
  clearTimeout(timer)
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
