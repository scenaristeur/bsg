import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// Middleware d'authentification
const requireAuth = (to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  if (!isLoggedIn && to.name !== 'login') {
    next({ name: 'login' })
  } else {
    next()
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      // Lazy loading for the signup component
      component: () => import('../components/SignUp.vue'),
    },
    {
      path: '/login',
      name: 'login',
      // Lazy loading for the login component
      component: () => import('../components/Login.vue'),
    },
    {
      path: '/users',
      name: 'users',
      // Lazy loading for the user list component
      component: () => import('../components/UserList.vue'),
      beforeEnter: requireAuth
    },
  ],
})

export default router
