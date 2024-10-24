import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import "bootstrap/dist/css/bootstrap.min.css";
import router from './router';
import vuetify from './plugins/vuetify'; 

createApp(App)
    .use(router)
    .use(vuetify)
    .mount('#app');