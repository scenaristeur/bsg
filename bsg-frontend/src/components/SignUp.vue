<template>
    <div class="signup-container">
        <h2>Inscription</h2>
        <form @submit.prevent="handleSignUp" class="signup-form">
            <div class="form-group">
                <label for="firstName">Prénom :</label>
                <input id="firstName" v-model="formData.firstName" type="text" required />
            </div>

            <div class="form-group">
                <label for="lastName">Nom :</label>
                <input id="lastName" v-model="formData.lastName" type="text" required />
            </div>

            <div class="form-group">
                <label for="username">Pseudo :</label>
                <input id="username" v-model="formData.username" type="text" required />
            </div>

            <div class="form-group">
                <label for="email">Email :</label>
                <input id="email" v-model="formData.email" type="email" required />
            </div>

            <div class="form-group">
                <label for="password">Mot de passe :</label>
                <input id="password" v-model="formData.password" type="password" required />
            </div>

            <div class="form-group">
                <label for="dateOfBirth">Date de naissance :</label>
                <input id="dateOfBirth" v-model="formData.dateOfBirth" type="date" />
            </div>

            <div class="form-group">
                <label for="interests">Centres d'intérêt :</label>
                <textarea id="interests" v-model="formData.interests" placeholder="Séparés par des virgules"></textarea>
            </div>

            <div class="form-group">
                <label for="meetingPreference">Préférences de rencontre :</label>
                <select id="meetingPreference" v-model="formData.meetingPreference">
                    <option value="transport">Transport en commun</option>
                    <option value="lieu">Lieu public</option>
                    <option value="restaurant">Restaurant</option>
                </select>
            </div>

            <div class="form-group">
                <label for="availability">Disponibilité :</label>
                <input id="availability" v-model="formData.availability" type="text"
                    placeholder="Ex: Soirées, Week-ends" />
            </div>

            <button type="submit" :disabled="loading">
                {{ loading ? 'Inscription en cours...' : 'S\'inscrire' }}
            </button>

            <div v-if="error" class="error-message">
                {{ error }}
            </div>

            <div v-if="success" class="success-message">
                {{ success }}
            </div>
        </form>
    </div>
</template>

<script>
import { userService } from '../services/userService'
import { useUserStore } from '../stores/user'

export default {
    name: 'SignUp',
    data() {
        return {
            formData: {
                firstName: '',
                lastName: '',
                username: '',
                email: '',
                password: ''
            },
            loading: false,
            error: null,
            success: null
        }
    },
    methods: {
        async handleSignUp() {
            this.loading = true
            this.error = null
            this.success = null

            try {
                // Validation basique des données
                if (!this.formData.firstName || !this.formData.lastName ||
                    !this.formData.username || !this.formData.email ||
                    !this.formData.password) {
                    throw new Error('Tous les champs sont requis')
                }

                // Utilisation du store utilisateur
                const userStore = useUserStore()

                // Appel au service pour créer l'utilisateur
                const userData = {
                    nom: this.formData.lastName,
                    prenom: this.formData.firstName,
                    pseudo: this.formData.username,
                    email: this.formData.email,
                    password: this.formData.password,
                    dateNaissance: this.formData.dateOfBirth || null,
                    interets: this.formData.interests || '',
                    preferencesRencontre: this.formData.meetingPreference || 'transport',
                    disponibilite: this.formData.availability || ''
                }

                const result = await userStore.register(userData)

                if (result.success) {
                    // Afficher un message de succès
                    this.success = 'Inscription réussie ! Vous pouvez maintenant vous connecter.'

                    // Réinitialiser le formulaire après un court délai
                    setTimeout(() => {
                        this.resetForm()
                        // Rediriger vers la page de connexion après inscription réussie
                        this.$router.push('/login')
                    }, 2000)
                } else {
                    this.error = result.error
                }

            } catch (err) {
                this.error = err.message || 'Une erreur est survenue lors de l\'inscription'
            } finally {
                this.loading = false
            }
        },
        resetForm() {
            this.formData = {
                firstName: '',
                lastName: '',
                username: '',
                email: '',
                password: ''
            }
        }
    }
}
</script>

<style scoped>
.signup-container {
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

.signup-form .form-group {
    margin-bottom: 1rem;
}

.signup-form label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #555;
}

.signup-form input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
}

.signup-form button {
    width: 100%;
    padding: 0.75rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
}

.signup-form button:hover:not(:disabled) {
    background-color: #0056b3;
}

.signup-form button:disabled {
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
</style>
