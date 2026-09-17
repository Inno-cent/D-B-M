import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import router from './router'
import { Toaster } from 'vue-sonner'
import './assets/css/main.css'

const app = createApp(App)
const head = createHead()

app.use(createPinia())
app.use(head)
app.component('Toaster', Toaster)
app.use(router)

app.mount('#app')

router.isReady().then(() => {
  document.dispatchEvent(new Event('app-rendered'))
})