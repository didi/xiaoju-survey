import { createApp } from 'vue'
import App from './App.vue';
import store from './store';
import router from './router'
import './styles/reset.scss';

import safeHtml from '../management/directive/safeHtml'


const app = createApp(App)

app.use(store)
// app.use(router)


app.use(safeHtml)

app.mount('#app')
