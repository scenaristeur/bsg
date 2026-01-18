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
import { authManager } from './modules/AuthManager'
import { notificationHandler } from './modules/NotificationHandler'

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

// Activer l'écouteur d'état d'authentification
authManager.onAuthStateChange((event, session) => {
    console.log('Changement d\'état d\'authentification:', event);
    if (event === 'SIGNED_IN') {
        store.commit('auth/SET_USER', session.user);
        store.commit('auth/SET_PERMISSIONS', ['read', 'write']);
    } else if (event === 'SIGNED_OUT') {
        store.commit('auth/RESET_AUTH_STATE');
    }
});

createApp(App).use(store).use(router).mount('#app')
