<template>
    <div class="sign-up-container">
        <h2>Inscription</h2>
        <form @submit.prevent="handleSignUp" class="sign-up-form">
            <div class="form-group">
                <label for="firstName">Prénom:</label>
                <input id="firstName" v-model="formData.firstName" type="text" required class="form-input" />
            </div>

            <div class="form-group">
                <label for="lastName">Nom:</label>
                <input id="lastName" v-model="formData.lastName" type="text" required class="form-input" />
            </div>

            <div class="form-group">
                <label for="pseudo">Pseudo:</label>
                <input id="pseudo" v-model="formData.pseudo" type="text" required class="form-input" />
            </div>

            <div class="form-group">
                <label for="email">Email:</label>
                <input id="email" v-model="formData.email" type="email" required class="form-input" />
            </div>

            <div class="form-group">
                <label for="password">Mot de passe:</label>
                <input id="password" v-model="formData.password" type="password" required class="form-input" />
            </div>

            <div class="form-group">
                <label for="dateOfBirth">Date de naissance:</label>
                <input id="dateOfBirth" v-model="formData.dateOfBirth" type="date" class="form-input" />
            </div>

            <div class="form-group">
                <label for="interests">Intérêts:</label>
                <textarea id="interests" v-model="formData.interests" class="form-textarea"></textarea>
            </div>

            <div class="form-group">
                <label for="preferences">Préférences de rencontre:</label>
                <select id="preferences" v-model="formData.preferences" class="form-select">
                    <option value="transport">Transport</option>
                    <option value="lieu">Lieu</option>
                    <option value="restaurant">Restaurant</option>
                </select>
            </div>

            <div class="form-group">
                <label for="availability">Disponibilité:</label>
                <input id="availability" v-model="formData.availability" type="text" class="form-input" />
            </div>

            <button type="submit" class="submit-btn">S'inscrire</button>
        </form>

        <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="success-message">
            {{ successMessage }}
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { userService } from '../services/userService'

export default {
    name: 'SignUp',
    data() {
        return {
            formData: {
                firstName: '',
                lastName: '',
                pseudo: '',
                email: '',
                password: '',
                dateOfBirth: '',
                interests: '',
                preferences: 'transport',
                availability: ''
            },
            errorMessage: '',
            successMessage: ''
        }
    },
    methods: {
        async handleSignUp() {
            try {
                // Validation basique
                if (!this.formData.email || !this.formData.password || !this.formData.firstName || !this.formData.lastName) {
                    this.errorMessage = 'Veuillez remplir tous les champs obligatoires.'
                    return
                }

                // Appel API pour créer l'utilisateur
                const response = await userService.createUser({
                    nom: this.formData.lastName,
                    prenom: this.formData.firstName,
                    pseudo: this.formData.pseudo,
                    email: this.formData.email,
                    password: this.formData.password,
                    dateNaissance: this.formData.dateOfBirth,
                    interets: this.formData.interests,
                    preferencesRencontre: this.formData.preferences,
                    disponibilite: this.formData.availability
                })

                this.successMessage = 'Inscription réussie ! Vous pouvez maintenant vous connecter.'
                this.errorMessage = ''

                // Redirection vers la page de login après un court délai
                setTimeout(() => {
                    this.$router.push('/login')
                }, 2000)

            } catch (error) {
                console.error('Erreur lors de l\'inscription:', error)
                if (error.message) {
                    this.errorMessage = error.message || 'Erreur lors de l\'inscription'
                } else {
                    this.errorMessage = 'Erreur réseau lors de l\'inscription'
                }
            }
        }
    }
}
</script>

<style scoped>
.sign-up-container {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.sign-up-form {
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

.form-input,
.form-textarea,
.form-select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
}

.form-textarea {
    height: 80px;
    resize: vertical;
}

.submit-btn {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.submit-btn:hover {
    background-color: #0056b3;
}

.error-message {
    color: red;
    margin-top: 10px;
    padding: 10px;
    background-color: #ffebee;
    border-radius: 4px;
}

.success-message {
    color: green;
    margin-top: 10px;
    padding: 10px;
    background-color: #e8f5e9;
    border-radius: 4px;
}
</style>
