import { createApp } from 'vue'
import store from './store'
import plainText from './directive/plainText'
import safeHtml from './directive/safeHtml'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(store)
app.use(router)

app.use(plainText)
app.use(safeHtml)

app.mount('#app')
