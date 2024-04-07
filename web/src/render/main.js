import { createApp } from 'vue'
import App from './App.vue';
import store from './store';
import DialogPlugin from '@/render/plugins/dialog/index';
import './styles/reset.scss';

// Vue.config.productionTip = false;

// Vue.use(DialogPlugin);


import safeHtml from '../management/directive/safeHtml'


const app = createApp(App)

app.use(store)


app.use(safeHtml)

app.mount('#app')
