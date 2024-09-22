import { createApp } from 'vue'
import { createPinia } from 'pinia'
import plainText from './directive/plainText'
import safeHtml from './directive/safeHtml'

import App from './App.vue'
import router from './router'

import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

app.use(plainText)
app.use(safeHtml)

app.mount('#app')
