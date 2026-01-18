import { createApp } from 'vue'
import App from './App.vue'
import { createStore } from 'vuex'
import {
    authModule,
    missionsModule,
    mapModule,
    notificationsModule,
    socialModule
} from './store/index'
import router from './router/index'

// Création du store Vuex avec les modules
const store = createStore({
    modules: {
        auth: authModule,
        missions: missionsModule,
        map: mapModule,
        notifications: notificationsModule,
        social: socialModule
    }
})

createApp(App).use(store).use(router).mount('#app')
