import { createRouter, createWebHistory } from 'vue-router'
import Auth from '../components/Auth.vue'
import Dashboard from '../components/Dashboard.vue'
import MissionMap from '../components/MissionMap.vue'
import MissionDetail from '../components/MissionDetail.vue'
import Profile from '../components/Profile.vue'
import ProfileCompletion from '../components/ProfileCompletion.vue'
import Notifications from '../components/Notifications.vue'
import SocialHub from '../components/SocialHub.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/auth'
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/map',
    name: 'MissionMap',
    component: MissionMap,
    meta: { requiresAuth: true }
  },
  {
    path: '/missions/:missionId',
    name: 'MissionDetail',
    component: MissionDetail,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/completion',
    name: 'ProfileCompletion',
    component: ProfileCompletion,
    meta: { requiresAuth: true }
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: Notifications,
    meta: { requiresAuth: true }
  },
  {
    path: '/social',
    name: 'SocialHub',
    component: SocialHub,
    meta: { requiresAuth: true }
  },
  {
    path: '/missions/new',
    name: 'NewMission',
    component: () => import('../components/GenerateMissionButton.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard pour protéger les routes nécessitant une authentification
router.beforeEach((to, from, next) => {
  // Vérification de l'état d'authentification depuis le store Vuex
  const isAuthenticated = localStorage.getItem('userToken') !== null

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth')
  } else {
    next()
  }
})

export default router
