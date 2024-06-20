import { createApp } from 'vue'
import App from './App.vue'
import EventBus from './utils/eventbus'
import router from './router'
import store from './store'

const app = createApp(App)

const $bus = new EventBus()
app.provide('$bus', $bus)
// 挂载到this上
app.config.globalProperties.$bus = $bus
app.use(router)
app.use(store)

app.mount('#app')
