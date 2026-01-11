<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/signup">S'inscrire</RouterLink>
        <RouterLink to="/login" v-if="!isLoggedIn">Se connecter</RouterLink>
        <RouterLink v-if="isLoggedIn" to="/users">Liste des utilisateurs</RouterLink>
        <button v-if="isLoggedIn" @click="handleLogout" class="logout-button">Se déconnecter</button>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false
    }
  },
  mounted() {
    this.checkAuthStatus()
  },
  watch: {
    '$route'() {
      this.checkAuthStatus()
    }
  },
  methods: {
    checkAuthStatus() {
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    },
    handleLogout() {
      // Supprimer les données de session
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('currentUser')

      // Rediriger vers la page de connexion
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

.logout-button {
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-left: 1rem;
}

.logout-button:hover {
  background-color: #c82333;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
