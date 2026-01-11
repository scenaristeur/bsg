<template>
    <div class="login-container">
        <h2>Connexion</h2>
        <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
                <label for="loginEmail">Email :</label>
                <input id="loginEmail" v-model="formData.email" type="email" required />
            </div>

            <div class="form-group">
                <label for="loginPassword">Mot de passe :</label>
                <input id="loginPassword" v-model="formData.password" type="password" required />
            </div>

            <button type="submit" :disabled="loading">
                {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
            </button>

            <div v-if="error" class="error-message">
                {{ error }}
            </div>

            <div v-if="success" class="success-message">
                {{ success }}
            </div>
        </form>

        <p class="signup-link">
            Pas encore de compte ? <router-link to="/signup">S'inscrire</router-link>
        </p>
    </div>
</template>

<script>
import { userService } from '../services/userService'

export default {
    name: 'Login',
    data() {
        return {
            formData: {
                email: '',
                password: ''
            },
            loading: false,
            error: null,
            success: null
        }
    },
    methods: {
        async handleLogin() {
            this.loading = true
            this.error = null
            this.success = null

            try {
                // Validation basique des données
                if (!this.formData.email || !this.formData.password) {
                    throw new Error('Email et mot de passe sont requis')
                }

                // Appel au service pour connecter l'utilisateur
                const credentials = {
                    email: this.formData.email,
                    password: this.formData.password
                }

                const result = await userService.loginUser(credentials)

                // Afficher un message de succès
                this.success = 'Connexion réussie ! Redirection...'

                // Stocker les informations de l'utilisateur dans le localStorage
                localStorage.setItem('currentUser', JSON.stringify(result.user))
                localStorage.setItem('isLoggedIn', 'true')

                // Rediriger vers la page d'accueil après connexion réussie
                setTimeout(() => {
                    this.$router.push('/')
                }, 1500)

            } catch (err) {
                this.error = err.message || 'Erreur lors de la connexion'
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style scoped>
.login-container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
    color: #333;
    margin-bottom: 1.5rem;
}

.login-form .form-group {
    margin-bottom: 1rem;
}

.login-form label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #555;
}

.login-form input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
}

.login-form button {
    width: 100%;
    padding: 0.75rem;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
}

.login-form button:hover:not(:disabled) {
    background-color: #218838;
}

.login-form button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}

.error-message {
    margin-top: 1rem;
    padding: 0.75rem;
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    text-align: center;
}

.success-message {
    margin-top: 1rem;
    padding: 0.75rem;
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
    border-radius: 4px;
    text-align: center;
}

.signup-link {
    margin-top: 1rem;
    text-align: center;
}

.signup-link a {
    color: #007bff;
    text-decoration: none;
}

.signup-link a:hover {
    text-decoration: underline;
}
</style>
