import { createApp } from 'vue'
import store from './store'
import './styles/element-variables.scss'
import ElementPlus from 'element-plus'
// 手动引入，避免ElMessage动态加载导致的el主题覆盖自定义主题
import 'element-plus/theme-chalk/el-message.css'    
import 'element-plus/theme-chalk/el-message-box.css'
import plainText from './directive/plainText'
import safeHtml from './directive/safeHtml'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(ElementPlus, { size: 'default'})

app.use(plainText)
app.use(safeHtml)

app.mount('#app')
