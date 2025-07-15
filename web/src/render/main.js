import { createApp } from 'vue'
import App from './App.vue'
import EventBus from './utils/eventbus'
import router from './router'
import { createPinia } from 'pinia'
import 'default-passive-events'
import { joinPath } from '@/common/utils/path'
import i18n from '../i18n/index'
import { useSurveyStore } from './providers/surveyStore'

const app = createApp(App)
const pinia = createPinia()

app.config.globalProperties.$base = import.meta.env.VITE_BASE
app.config.globalProperties.joinPath = joinPath

const $bus = new EventBus()
app.provide('$bus', $bus)
// 挂载到this上
app.config.globalProperties.$bus = $bus
app.use(i18n)
app.use(pinia)
app.use(router)

app.provide('surveyStore', useSurveyStore())

app.mount('#app')
