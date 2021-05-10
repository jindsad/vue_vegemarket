import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import locale from 'element-plus/lib/locale/lang/zh-cn'
createApp(App)
    .use(ElementPlus,{locale})
    .use(router)
    .use(store)
    .mount('#app')
