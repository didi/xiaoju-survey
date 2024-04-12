import { createApp } from 'vue'
import App from './App.vue';
import store from './store';
import './styles/reset.scss';

import safeHtml from '../management/directive/safeHtml'
import EventBus from './utils/eventbus'
const $bus = new EventBus()
const app = createApp(App)
app.provide('$bus', $bus)
app.config.globalProperties.$bus = $bus

app.use(store)


app.use(safeHtml)

app.mount('#app')


