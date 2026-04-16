import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { Toaster } from 'vue-sonner';
import './assets/css/main.css'

const app = createApp(App)
app.use(createPinia())
app.component('Toaster', Toaster);
app.use(router)
app.mount('#app')