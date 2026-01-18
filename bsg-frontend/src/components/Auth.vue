<template>
    <div class="auth-container">
        <div class="auth-card">
            <h2>Connexion à BSG</h2>

            <!-- Onglets pour changer de méthode d'authentification -->
            <div class="auth-tabs">
                <button :class="{ active: activeTab === 'login' }" @click="activeTab = 'login'">
                    Connexion
                </button>
                <button :class="{ active: activeTab === 'signup' }" @click="activeTab = 'signup'">
                    Inscription
                </button>
            </div>

            <!-- Formulaire de connexion -->
            <form v-if="activeTab === 'login'" @submit.prevent="handleLogin">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input id="email" v-model="loginForm.email" type="email" required placeholder="Votre email" />
                </div>

                <div class="form-group">
                    <label for="password">Mot de passe</label>
                    <input id="password" v-model="loginForm.password" type="password" required
                        placeholder="Votre mot de passe" />
                </div>

                <button type="submit" :disabled="loading">
                    {{ loading ? 'Connexion...' : 'Se connecter' }}
                </button>
            </form>

            <!-- Formulaire d'inscription -->
            <form v-else-if="activeTab === 'signup'" @submit.prevent="handleSignup">
                <div class="form-group">
                    <label for="signup-email">Email</label>
                    <input id="signup-email" v-model="signupForm.email" type="email" required
                        placeholder="Votre email" />
                </div>

                <div class="form-group">
                    <label for="signup-password">Mot de passe</label>
                    <input id="signup-password" v-model="signupForm.password" type="password" required
                        placeholder="Votre mot de passe" />
                </div>

                <div class="form-group">
                    <label for="pseudo">Pseudo</label>
                    <input id="pseudo" v-model="signupForm.pseudo" type="text" required placeholder="Votre pseudo" />
                </div>

                <div class="form-group">
                    <label for="nom">Nom</label>
                    <input id="nom" v-model="signupForm.nom" type="text" required placeholder="Votre nom" />
                </div>

                <div class="form-group">
                    <label for="prenom">Prénom</label>
                    <input id="prenom" v-model="signupForm.prenom" type="text" required placeholder="Votre prénom" />
                </div>

                <button type="submit" :disabled="loading">
                    {{ loading ? 'Inscription...' : 'S\'inscrire' }}
                </button>
            </form>

            <!-- Message d'erreur -->
            <div v-if="error" class="error-message">
                {{ error }}
            </div>

            <!-- Message de succès -->
            <div v-if="success" class="success-message">
                {{ success }}
            </div>
        </div>
    </div>
</template>

<script>
import { authManager } from '../modules/AuthManager'

export default {
    name: 'Auth',
    data() {
        return {
            activeTab: 'login',
            loginForm: {
                email: '',
                password: ''
            },
            signupForm: {
                email: '',
                password: '',
                pseudo: '',
                nom: '',
                prenom: ''
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

            try {
                const result = await authManager.signIn(this.loginForm.email, this.loginForm.password)
                if (result.success) {
                    this.success = 'Connexion réussie !'
                    // Stocker le token d'authentification dans localStorage
                    const token = await authManager.getAuthToken()
                    localStorage.setItem('userToken', token)
                    // Redirection vers le dashboard
                    this.$router.push('/dashboard')
                } else {
                    this.error = result.error
                }
            } catch (error) {
                this.error = 'Erreur lors de la connexion'
            } finally {
                this.loading = false
            }
        },

        async handleSignup() {
            this.loading = true
            this.error = null

            try {
                const result = await authManager.signUp({
                    email: this.signupForm.email,
                    password: this.signupForm.password,
                    pseudo: this.signupForm.pseudo,
                    nom: this.signupForm.nom,
                    prenom: this.signupForm.prenom
                })

                if (result.success) {
                    this.success = 'Inscription réussie ! Vous pouvez maintenant vous connecter.'
                    this.activeTab = 'login'
                    this.signupForm = {
                        email: '',
                        password: '',
                        pseudo: '',
                        nom: '',
                        prenom: ''
                    }
                    // Stocker le token d'authentification dans localStorage après inscription
                    const token = await authManager.getAuthToken()
                    localStorage.setItem('userToken', token)
                    // Redirection vers le dashboard après inscription
                    this.$router.push('/dashboard')
                } else {
                    this.error = result.error
                }
            } catch (error) {
                this.error = 'Erreur lors de l\'inscription'
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style scoped>
.auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
}

.auth-card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

.auth-card h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
}

.auth-tabs {
    display: flex;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #eee;
}

.auth-tabs button {
    flex: 1;
    padding: 0.75rem;
    background: none;
    border: none;
    cursor: pointer;
    font-weight: bold;
    color: #666;
    border-bottom: 2px solid transparent;
}

.auth-tabs button.active {
    color: #007bff;
    border-bottom-color: #007bff;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #333;
}

.form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

button {
    width: 100%;
    padding: 0.75rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

button:hover:not(:disabled) {
    background-color: #0056b3;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.error-message {
    margin-top: 1rem;
    padding: 0.75rem;
    background-color: #f8d7da;
    color: #721c24;
    border-radius: 4px;
    text-align: center;
}

.success-message {
    margin-top: 1rem;
    padding: 0.75rem;
    background-color: #d4edda;
    color: #155724;
    border-radius: 4px;
    text-align: center;
}
</style>
