<script>
import { RouterLink, RouterView } from 'vue-router'
import { mapGetters } from 'vuex'
import { authManager } from './modules/AuthManager'

export default {
  name: 'App',
  computed: {
    ...mapGetters('auth', ['isLoggedIn'])
  },
  methods: {
    handleLogout() {
      // Utiliser le store Vuex pour la déconnexion
      this.$store.dispatch('auth/logout')
      // Rediriger vers la page de connexion
      // La redirection sera gérée par le routeur grâce au middleware
    }
  },
  mounted() {
    // Vérifier l'état d'authentification au montage de l'application
    // Utiliser l'écouteur d'état d'authentification pour gérer l'état initial
    authManager.onAuthStateChange((event, session) => {
      console.log('Changement d\'état d\'authentification détecté:', event);
      if (event === 'SIGNED_IN' && session?.user) {
        // L'utilisateur est connecté, on peut charger ses données
        console.log('Utilisateur connecté:', session.user);
      } else if (event === 'SIGNED_OUT') {
        // L'utilisateur est déconnecté
        console.log('Utilisateur déconnecté');
      }
    });
  }
}
</script>

<template>
  <div class="app-container">
    <!-- Header avec menu horizontal -->
    <header class="app-header">
      <div class="header-content">
        <img alt="Vue logo" class="logo" src="@/assets/logo.png" width="125" height="125" />

        <nav class="horizontal-menu">
          <RouterLink to="/" class="menu-item">Accueil</RouterLink>
          <RouterLink to="/about" class="menu-item">À propos</RouterLink>
          <RouterLink to="/profile" class="menu-item" v-if="isLoggedIn">Mon Profil</RouterLink>
          <button v-if="isLoggedIn" @click="handleLogout" class="logout-button menu-item">Déconnexion</button>
        </nav>
      </div>
    </header>

    <RouterView />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.logo {
  display: block;
  margin: 0 1rem 0 0;
}

.horizontal-menu {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.menu-item {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #333;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background-color: #e9ecef;
  color: #007bff;
}

.menu-item.router-link-exact-active {
  background-color: #007bff;
  color: white;
}

.logout-button {
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-left: 0.5rem;
}

.logout-button:hover {
  background-color: #c82333;
}

/* Responsive design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .logo {
    margin: 0 0 1rem 0;
  }

  .horizontal-menu {
    justify-content: center;
  }
}
</style>
