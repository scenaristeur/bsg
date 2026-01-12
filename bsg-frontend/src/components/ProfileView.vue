<template>
    <div class="profile-container">
        <div class="profile-header">
            <div class="profile-avatar">
                {{ currentUser?.pseudo?.charAt(0).toUpperCase() || 'U' }}
            </div>
            <div class="profile-info">
                <h2>{{ currentUser?.pseudo || 'Utilisateur' }}</h2>
                <p>{{ currentUser?.prenom }} {{ currentUser?.nom }}</p>
                <p>{{ currentUser?.email }}</p>
            </div>
        </div>

        <div class="profile-content">
            <div class="profile-section">
                <h3>Informations personnelles</h3>
                <div class="profile-details">
                    <div class="detail-row">
                        <span class="label">Nom:</span>
                        <span class="value">{{ currentUser?.nom || 'Non spécifié' }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Prénom:</span>
                        <span class="value">{{ currentUser?.prenom || 'Non spécifié' }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Pseudo:</span>
                        <span class="value">{{ currentUser?.pseudo || 'Non spécifié' }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Email:</span>
                        <span class="value">{{ currentUser?.email || 'Non spécifié' }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Date de naissance:</span>
                        <span class="value">{{ formatDate(currentUser?.dateNaissance) || 'Non spécifié' }}</span>
                    </div>
                </div>
            </div>

            <div class="profile-section">
                <h3>Préférences de rencontre</h3>
                <div class="profile-details">
                    <div class="detail-row">
                        <span class="label">Type de rencontre:</span>
                        <span class="value">{{ getPreferenceLabel(currentUser?.preferencesRencontre) || 'Non spécifié'
                            }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Âge minimum:</span>
                        <span class="value">{{ currentUser?.preferencesRencontre?.age_min || 'Non spécifié' }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Âge maximum:</span>
                        <span class="value">{{ currentUser?.preferencesRencontre?.age_max || 'Non spécifié' }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Distance maximale:</span>
                        <span class="value">{{ currentUser?.preferencesRencontre?.distance_max || 'Non spécifié' }}
                            km</span>
                    </div>
                </div>
            </div>

            <div class="profile-section">
                <h3>Autres informations</h3>
                <div class="profile-details">
                    <div class="detail-row">
                        <span class="label">Intérêts:</span>
                        <span class="value">{{ currentUser?.interets || 'Aucun intérêt spécifié' }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Disponibilité:</span>
                        <span class="value">{{ currentUser?.disponibilite || 'Non spécifié' }}</span>
                    </div>
                </div>
            </div>

            <div class="profile-actions">
                <button @click="editProfile" class="btn btn-primary">Modifier le profil</button>
                <button @click="logout" class="btn btn-secondary">Déconnexion</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProfileView',
    data() {
        return {
            currentUser: null
        }
    },
    methods: {
        // Récupération des informations de l'utilisateur depuis le localStorage
        fetchUserProfile() {
            try {
                const storedUser = localStorage.getItem('currentUser')
                if (storedUser) {
                    this.currentUser = JSON.parse(storedUser)
                }
            } catch (error) {
                console.error('Erreur lors de la récupération du profil utilisateur:', error)
            }
        },

        // Formatage de la date
        formatDate(dateString) {
            if (!dateString) return 'Non spécifié'
            const date = new Date(dateString)
            return date.toLocaleDateString('fr-FR')
        },

        // Récupération du libellé de préférence
        getPreferenceLabel(preference) {
            if (!preference) return 'Non spécifié'
            switch (preference) {
                case 'transport':
                    return 'Transport'
                case 'lieu':
                    return 'Lieu'
                case 'restaurant':
                    return 'Restaurant'
                default:
                    return preference
            }
        },

        // Modification du profil
        editProfile() {
            console.log('Modifier le profil')
            // Ici, vous pouvez rediriger vers la page de modification du profil
        },

        // Déconnexion
        logout() {
            // Suppression des données de l'utilisateur du localStorage
            localStorage.removeItem('userToken')
            localStorage.removeItem('currentUser')

            // Redirection vers la page de connexion
            this.$router.push('/login')
        }
    },
    mounted() {
        this.fetchUserProfile()
    }
}
</script>

<style scoped>
.profile-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.profile-header {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #007bff;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: bold;
    margin-right: 20px;
}

.profile-info h2 {
    margin: 0 0 5px 0;
    color: #007bff;
}

.profile-info p {
    margin: 5px 0;
    font-size: 14px;
    color: #6c757d;
}

.profile-content {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-section {
    margin-bottom: 25px;
}

.profile-section h3 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #007bff;
    border-bottom: 1px solid #ddd;
    padding-bottom: 5px;
}

.profile-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

.detail-row {
    display: flex;
    flex-direction: column;
}

.label {
    font-weight: bold;
    color: #007bff;
    margin-bottom: 3px;
}

.value {
    font-size: 14px;
    color: #333;
}

.profile-actions {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-top: 30px;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    text-decoration: none;
    display: inline-block;
}

.btn-primary {
    background-color: #007bff;
    color: white;
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
}

@media (max-width: 768px) {
    .profile-header {
        flex-direction: column;
        text-align: center;
    }

    .profile-avatar {
        margin-right: 0;
        margin-bottom: 15px;
    }

    .profile-details {
        grid-template-columns: 1fr;
    }

    .profile-actions {
        flex-direction: column;
    }
}
</style>
