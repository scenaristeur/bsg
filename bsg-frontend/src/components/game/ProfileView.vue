<template>
    <div class="profile-view">
        <h2>Mon Profil</h2>
        <div class="profile-form">
            <div class="form-group">
                <label>Nom:</label>
                <input v-model="userProfile.nom" disabled />
            </div>
            <div class="form-group">
                <label>Prénom:</label>
                <input v-model="userProfile.prenom" disabled />
            </div>
            <div class="form-group">
                <label>Email:</label>
                <input v-model="userProfile.email" disabled />
            </div>
            <div class="form-group">
                <label>Date de naissance:</label>
                <input v-model="userProfile.dateNaissance" type="date" />
            </div>
            <div class="form-group">
                <label>Centres d'intérêt:</label>
                <textarea v-model="userProfile.interets"></textarea>
            </div>
            <div class="form-group">
                <label>Préférences de rencontre:</label>
                <select v-model="userProfile.preferencesRencontre">
                    <option value="transport">Transport en commun</option>
                    <option value="lieu">Lieu public</option>
                    <option value="restaurant">Restaurant</option>
                </select>
            </div>
            <div class="form-group">
                <label>Disponibilité:</label>
                <input v-model="userProfile.disponibilite" type="text" placeholder="Ex: Soirées, Week-ends" />
            </div>
            <button @click="saveProfile" class="save-btn">Sauvegarder</button>
        </div>
    </div>
</template>

<script>
import { useUserStore } from '../../stores/user'
import { userService } from '../../services/userService'

export default {
    name: 'ProfileView',
    data() {
        return {
            userProfile: {
                nom: '',
                prenom: '',
                email: '',
                dateNaissance: '',
                interets: '',
                preferencesRencontre: '',
                disponibilite: ''
            }
        }
    },
    mounted() {
        this.syncUserData()
    },
    methods: {
        // Méthode pour synchroniser les données utilisateur
        syncUserData() {
            const userStore = useUserStore()
            if (userStore.currentUser) {
                this.userProfile = {
                    nom: userStore.currentUser.nom || '',
                    prenom: userStore.currentUser.prenom || '',
                    email: userStore.currentUser.email || '',
                    dateNaissance: userStore.currentUser.dateNaissance || '',
                    interets: userStore.currentUser.interets || '',
                    preferencesRencontre: userStore.currentUser.preferencesRencontre || '',
                    disponibilite: userStore.currentUser.disponibilite || ''
                }
            }
        },
        async saveProfile() {
            try {
                // Envoyer les modifications au backend
                const userStore = useUserStore()
                console.log('Données envoyées au backend:', {
                    userId: userStore.currentUser.id,
                    userData: this.userProfile
                });
                const response = await userService.updateUser(userStore.currentUser.id, this.userProfile)
                // Mettre à jour le store avec les nouvelles données
                userStore.setCurrentUser(response.user)
                alert('Profil sauvegardé avec succès !')
            } catch (error) {
                console.error('Erreur lors de la sauvegarde du profil:', error)
                alert('Erreur lors de la sauvegarde du profil')
            }
        }
    }
}
</script>

<style scoped>
.profile-view {
    padding: 1rem;
}

.profile-form .form-group {
    margin-bottom: 1rem;
}

.profile-form label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #555;
}

.profile-form input,
.profile-form textarea,
.profile-form select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
}

.save-btn {
    padding: 0.75rem 1.5rem;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
}

.save-btn:hover {
    background-color: #218838;
}
</style>
