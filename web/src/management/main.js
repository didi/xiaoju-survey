import { createApp } from 'vue'
import { createPinia } from 'pinia'
import plainText from './directive/plainText'
import safeHtml from './directive/safeHtml'
import { joinPath } from '@/common/utils/path'
import i18n from '../i18n/index'
import { useSurveyStore } from './providers/surveyStore'

import App from './App.vue'
import router from './router'

import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const pinia = createPinia()
const app = createApp(App)

app.config.globalProperties.$base = import.meta.env.VITE_BASE
app.config.globalProperties.joinPath = joinPath

app.use(i18n)
app.use(pinia)
app.use(router)

app.use(plainText)
app.use(safeHtml)

app.provide('surveyStore', useSurveyStore())

app.mount('#app')
