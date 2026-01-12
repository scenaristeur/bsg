<template>
    <div class="user-list-container">
        <h2>Liste des Utilisateurs</h2>

        <div class="search-bar">
            <input v-model="searchTerm" type="text" placeholder="Rechercher un utilisateur..." class="search-input" />
        </div>

        <div class="user-filters">
            <select v-model="filterPreferences" class="filter-select">
                <option value="">Toutes préférences</option>
                <option value="transport">Transport</option>
                <option value="lieu">Lieu</option>
                <option value="restaurant">Restaurant</option>
            </select>

            <select v-model="filterAvailability" class="filter-select">
                <option value="">Toute disponibilité</option>
                <option value="Soirées">Soirées</option>
                <option value="Week-ends">Week-ends</option>
                <option value="Jours de semaine">Jours de semaine</option>
            </select>
        </div>

        <div v-if="loading" class="loading">Chargement...</div>

        <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
        </div>

        <div class="users-grid">
            <div v-for="user in filteredUsers" :key="user.id" class="user-card">
                <div class="user-avatar">
                    {{ user.pseudo.charAt(0).toUpperCase() }}
                </div>
                <div class="user-info">
                    <h3>{{ user.pseudo }}</h3>
                    <p><strong>Nom:</strong> {{ user.nom }} {{ user.prenom }}</p>
                    <p><strong>Email:</strong> {{ user.email }}</p>
                    <p><strong>Préférences:</strong> {{ user.preferencesRencontre }}</p>
                    <p><strong>Disponibilité:</strong> {{ user.disponibilite }}</p>
                    <p><strong>Âge:</strong> {{ calculateAge(user.dateNaissance) }} ans</p>
                </div>
                <div class="user-actions">
                    <button @click="viewProfile(user.id)" class="btn btn-primary">Voir le profil</button>
                    <button @click="sendMessage(user.id)" class="btn btn-secondary">Envoyer un message</button>
                </div>
            </div>
        </div>

        <div v-if="!loading && !errorMessage && filteredUsers.length === 0" class="no-users">
            Aucun utilisateur trouvé.
        </div>
    </div>
</template>

<script>
import { api } from '../utils/api'

export default {
    name: 'UserList',
    data() {
        return {
            users: [],
            loading: false,
            errorMessage: '',
            searchTerm: '',
            filterPreferences: '',
            filterAvailability: ''
        }
    },
    computed: {
        filteredUsers() {
            return this.users.filter(user => {
                const matchesSearch = user.pseudo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                    user.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                    user.prenom.toLowerCase().includes(this.searchTerm.toLowerCase())

                const matchesPreferences = !this.filterPreferences || user.preferencesRencontre === this.filterPreferences
                const matchesAvailability = !this.filterAvailability || user.disponibilite === this.filterAvailability

                return matchesSearch && matchesPreferences && matchesAvailability
            })
        }
    },
    methods: {
        // Récupération des utilisateurs depuis l'API
        async fetchUsers() {
            try {
                this.loading = true
                this.errorMessage = ''

                const response = await api.getUsers()
                this.users = response

            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error)
                this.errorMessage = 'Erreur lors de la récupération des utilisateurs'
            } finally {
                this.loading = false
            }
        },

        // Calcul de l'âge à partir de la date de naissance
        calculateAge(birthDate) {
            if (!birthDate) return 'Non spécifié'
            const today = new Date()
            const birth = new Date(birthDate)
            let age = today.getFullYear() - birth.getFullYear()
            const monthDiff = today.getMonth() - birth.getMonth()

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--
            }

            return age
        },

        // Navigation vers le profil
        viewProfile(userId) {
            // Ici, vous pouvez rediriger vers la page de profil
            console.log('Voir le profil de l\'utilisateur:', userId)
        },

        // Envoi d'un message
        sendMessage(userId) {
            // Ici, vous pouvez ouvrir le chat avec cet utilisateur
            console.log('Envoyer un message à l\'utilisateur:', userId)
        }
    },
    mounted() {
        this.fetchUsers()
    }
}
</script>

<style scoped>
.user-list-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.search-bar {
    margin-bottom: 20px;
}

.search-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
}

.user-filters {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.filter-select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.loading {
    text-align: center;
    padding: 20px;
}

.error-message {
    color: red;
    padding: 10px;
    background-color: #ffebee;
    border-radius: 4px;
    margin-bottom: 20px;
}

.users-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.user-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #007bff;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
}

.user-info h3 {
    margin: 0 0 10px 0;
    color: #007bff;
}

.user-info p {
    margin: 5px 0;
    font-size: 14px;
}

.user-actions {
    margin-top: 15px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.btn {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.btn-primary {
    background-color: #007bff;
    color: white;
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
}

.no-users {
    text-align: center;
    padding: 40px;
    color: #6c757d;
    font-style: italic;
}

@media (max-width: 768px) {
    .users-grid {
        grid-template-columns: 1fr;
    }

    .user-filters {
        flex-direction: column;
    }
}
</style>
