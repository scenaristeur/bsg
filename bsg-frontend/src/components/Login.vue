<template>
    <div class="login-container">
        <h2>Connexion</h2>
        <form class="login-form">
            <div class="form-group">
                <label for="loginEmail">Email:</label>
                <input id="loginEmail" v-model="loginForm.email" type="email" required class="form-input" />
            </div>

            <div class="form-group">
                <label for="loginPassword">Mot de passe:</label>
                <input id="loginPassword" v-model="loginForm.password" type="password" required class="form-input" />
            </div>

            <button type="button" @click="handleLogin" class="submit-btn">Se connecter</button>
        </form>

        <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
        </div>

        <div class="signup-link">
            <p>Vous n'avez pas de compte ? <router-link to="/signup">Inscrivez-vous ici</router-link></p>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { userService } from '../services/userService'
import { useUserStore } from '../stores/user'

export default {
    name: 'Login',
    data() {
        return {
            loginForm: {
                email: '',
                password: ''
            },
            errorMessage: ''
        }
    },
    methods: {
        async handleLogin() {
            console.log('Tentative de connexion avec:', this.loginForm)
            try {
                // Validation basique
                if (!this.loginForm.email || !this.loginForm.password) {
                    this.errorMessage = 'Veuillez remplir tous les champs.'
                    return
                }

                // Appel au service utilisateur pour la connexion
                console.log('Appel au service utilisateur pour la connexion...')
                const response = await userService.loginUser({
                    email: this.loginForm.email,
                    password: this.loginForm.password
                })
                console.log('Réponse du service utilisateur:', response)

                // Utilisation du store utilisateur
                const userStore = useUserStore()
                userStore.setCurrentUser(response.user)

                this.errorMessage = ''

                // Redirection vers la page de jeu
                this.$router.push('/game')

            } catch (error) {
                console.error('Erreur lors de la connexion:', error)
                console.error('Erreur détaillée:', error.message, error.response)
                if (error.message) {
                    this.errorMessage = error.message || 'Erreur lors de la connexion'
                } else {
                    this.errorMessage = 'Erreur réseau lors de la connexion'
                }
            }
        }
    }
}
</script>

<style scoped>
.login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.login-form {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.form-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
}

.submit-btn {
    width: 100%;
    padding: 10px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.submit-btn:hover {
    background-color: #218838;
}

.error-message {
    color: red;
    margin-top: 10px;
    padding: 10px;
    background-color: #ffebee;
    border-radius: 4px;
}

.signup-link {
    margin-top: 15px;
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
