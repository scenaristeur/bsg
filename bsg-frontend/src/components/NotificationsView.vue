<template>
    <div class="notifications-container">
        <h2>Notifications et Interactions</h2>

        <div class="notifications-header">
            <div class="tabs">
                <button :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'" class="tab-btn">
                    Toutes les notifications
                </button>
                <button :class="{ active: activeTab === 'messages' }" @click="activeTab = 'messages'" class="tab-btn">
                    Messages
                </button>
                <button :class="{ active: activeTab === 'calls' }" @click="activeTab = 'calls'" class="tab-btn">
                    Appels
                </button>
                <button :class="{ active: activeTab === 'meetings' }" @click="activeTab = 'meetings'" class="tab-btn">
                    Rencontres
                </button>
            </div>
        </div>

        <div v-if="loading" class="loading">Chargement...</div>

        <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
        </div>

        <div class="notifications-list">
            <div v-for="notification in filteredNotifications" :key="notification.id" class="notification-card">
                <div class="notification-header">
                    <div class="notification-avatar">
                        {{ getOtherUserInitial(notification) }}
                    </div>
                    <div class="notification-info">
                        <h4>{{ getOtherUserName(notification) }}</h4>
                        <p class="notification-type">{{ getNotificationType(notification) }}</p>
                    </div>
                    <div class="notification-time">
                        {{ formatDate(notification.createdAt) }}
                    </div>
                </div>

                <div class="notification-content">
                    <p>{{ notification.contenu }}</p>
                </div>

                <div class="notification-actions">
                    <button v-if="notification.type === 'message'" @click="replyToMessage(notification)"
                        class="btn btn-primary">
                        Répondre
                    </button>
                    <button v-if="notification.type === 'appel'" @click="makeCall(notification)"
                        class="btn btn-success">
                        Appeler
                    </button>
                    <button v-if="notification.type === 'rencontre'" @click="viewMeetingDetails(notification)"
                        class="btn btn-secondary">
                        Détails
                    </button>
                </div>
            </div>
        </div>

        <div v-if="!loading && !errorMessage && filteredNotifications.length === 0" class="no-notifications">
            Aucune notification disponible.
        </div>
    </div>
</template>

<script>
import { api } from '../utils/api'

export default {
    name: 'NotificationsView',
    data() {
        return {
            notifications: [],
            loading: false,
            errorMessage: '',
            activeTab: 'all',
            currentUser: null
        }
    },
    computed: {
        filteredNotifications() {
            if (this.activeTab === 'all') {
                return this.notifications
            }

            return this.notifications.filter(notification =>
                notification.type === this.activeTab
            )
        }
    },
    methods: {
        // Récupération des notifications depuis l'API
        async fetchNotifications() {
            try {
                this.loading = true
                this.errorMessage = ''

                // Récupération de l'utilisateur courant depuis le localStorage
                const storedUser = localStorage.getItem('currentUser')
                if (storedUser) {
                    this.currentUser = JSON.parse(storedUser)
                }

                const response = await api.getInteractions()
                this.notifications = response

            } catch (error) {
                console.error('Erreur lors de la récupération des notifications:', error)
                this.errorMessage = 'Erreur lors de la récupération des notifications'
            } finally {
                this.loading = false
            }
        },

        // Récupération du nom de l'autre utilisateur
        getOtherUserName(notification) {
            if (!this.currentUser) return 'Utilisateur inconnu'

            // Pour les messages, on cherche l'autre utilisateur
            if (notification.userId1 === this.currentUser.id) {
                // On suppose qu'on a une méthode pour récupérer les détails de l'utilisateur
                return `Utilisateur ${notification.userId2}`
            } else {
                return `Utilisateur ${notification.userId1}`
            }
        },

        // Récupération de la première lettre du nom de l'autre utilisateur
        getOtherUserInitial(notification) {
            const userName = this.getOtherUserName(notification)
            return userName.charAt(0).toUpperCase()
        },

        // Récupération du type de notification
        getNotificationType(notification) {
            switch (notification.type) {
                case 'message':
                    return 'Nouveau message'
                case 'appel':
                    return 'Appel entrant'
                case 'rencontre':
                    return 'Rencontre programmée'
                default:
                    return 'Notification'
            }
        },

        // Formatage de la date
        formatDate(dateString) {
            if (!dateString) return 'Inconnue'
            const date = new Date(dateString)
            return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            })
        },

        // Répondre à un message
        replyToMessage(notification) {
            console.log('Répondre au message:', notification.id)
            // Ici, vous pouvez ouvrir le chat avec cet utilisateur
        },

        // Faire un appel
        makeCall(notification) {
            console.log('Faire un appel:', notification.id)
            // Ici, vous pouvez lancer un appel audio/vidéo
        },

        // Voir les détails d'une rencontre
        viewMeetingDetails(notification) {
            console.log('Voir les détails de la rencontre:', notification.id)
            // Ici, vous pouvez rediriger vers la page de détails de la rencontre
        }
    },
    mounted() {
        this.fetchNotifications()
    }
}
</script>

<style scoped>
.notifications-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.notifications-header {
    margin-bottom: 20px;
}

.tabs {
    display: flex;
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px;
}

.tab-btn {
    padding: 10px 20px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 14px;
    border-bottom: 2px solid transparent;
}

.tab-btn.active {
    border-bottom: 2px solid #007bff;
    color: #007bff;
    font-weight: bold;
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

.notifications-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.notification-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.notification-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.notification-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #007bff;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
    margin-right: 10px;
}

.notification-info h4 {
    margin: 0 0 5px 0;
    color: #007bff;
}

.notification-type {
    margin: 0;
    font-size: 12px;
    color: #6c757d;
}

.notification-time {
    margin-left: auto;
    font-size: 12px;
    color: #6c757d;
}

.notification-content {
    margin-bottom: 15px;
}

.notification-content p {
    margin: 0;
    font-size: 14px;
    line-height: 1.4;
}

.notification-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

.btn {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    text-decoration: none;
    display: inline-block;
}

.btn-primary {
    background-color: #007bff;
    color: white;
}

.btn-success {
    background-color: #28a745;
    color: white;
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
}

.no-notifications {
    text-align: center;
    padding: 40px;
    color: #6c757d;
    font-style: italic;
}

@media (max-width: 768px) {
    .notification-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .notification-time {
        margin-left: 0;
        margin-top: 5px;
    }

    .notification-actions {
        flex-direction: column;
    }
}
</style>
