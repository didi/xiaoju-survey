import { createApp } from 'vue'
import store from './store'
import './styles/element-variables.scss'
import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
import plainText from './directive/plainText'
import safeHtml from './directive/safeHtml'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(ElementPlus)

app.use(plainText)
app.use(safeHtml)

app.mount('#app')
