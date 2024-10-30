import { createApp } from 'vue'
import App from './App.vue'
import EventBus from './utils/eventbus'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

const $bus = new EventBus()
app.provide('$bus', $bus)
// 挂载到this上
app.config.globalProperties.$bus = $bus
app.use(pinia)
app.use(router)

app.mount('#app')
