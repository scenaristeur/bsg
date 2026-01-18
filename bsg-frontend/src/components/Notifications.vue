<template>
    <div class="notifications">
        <header class="notifications-header">
            <h1>Notifications</h1>
            <div class="notifications-controls">
                <button @click="markAllAsRead" class="btn-secondary" :disabled="unreadCount === 0">
                    Tout marquer comme lu
                </button>
                <button @click="clearAll" class="btn-outline" :disabled="notifications.length === 0">
                    Tout effacer
                </button>
            </div>
        </header>

        <div class="notifications-content">
            <div v-if="loading" class="loading">
                Chargement des notifications...
            </div>

            <div v-else-if="notifications.length === 0" class="empty-state">
                <p>Aucune notification pour le moment.</p>
            </div>

            <div v-else class="notifications-list">
                <div v-for="notification in notifications" :key="notification.id"
                    :class="['notification-item', { unread: !notification.lu }]">
                    <div class="notification-content">
                        <div class="notification-icon">
                            <span v-if="notification.type === 'mission'">🎯</span>
                            <span v-else-if="notification.type === 'social'">👥</span>
                            <span v-else-if="notification.type === 'system'">⚙️</span>
                            <span v-else>🔔</span>
                        </div>
                        <div class="notification-text">
                            <h3>{{ notification.titre }}</h3>
                            <p>{{ notification.message }}</p>
                            <div class="notification-meta">
                                <span class="notification-time">{{ formatTime(notification.created_at) }}</span>
                                <span class="notification-type">{{ getNotificationTypeLabel(notification.type) }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="notification-actions">
                        <button v-if="!notification.lu" @click="markAsRead(notification.id)" class="btn-small">
                            Marquer comme lu
                        </button>
                        <button @click="deleteNotification(notification.id)" class="btn-small btn-danger">
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
    name: 'Notifications',
    data() {
        return {
            loading: false
        }
    },
    computed: {
        ...mapState('notifications', ['notifications']),
        ...mapGetters('notifications', ['unreadCount'])
    },
    async mounted() {
        await this.loadNotifications()
    },
    methods: {
        ...mapActions('notifications', [
            'loadNotifications',
            'markAsRead',
            'markAllAsRead',
            'deleteNotification',
            'clearAll'
        ]),

        async loadNotifications() {
            this.loading = true
            try {
                await this.loadNotifications()
            } catch (error) {
                console.error('Erreur lors du chargement des notifications:', error)
            } finally {
                this.loading = false
            }
        },

        formatTime(dateString) {
            if (!dateString) return ''
            const date = new Date(dateString)
            return date.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            })
        },

        getNotificationTypeLabel(type) {
            const labels = {
                'mission': 'Mission',
                'social': 'Social',
                'system': 'Système'
            }
            return labels[type] || type
        }
    }
}
</script>

<style scoped>
.notifications {
    min-height: 100vh;
    background-color: #f8f9fa;
}

.notifications-header {
    background-color: #fff;
    padding: 1rem 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.notifications-header h1 {
    margin: 0;
    color: #333;
}

.notifications-controls {
    display: flex;
    gap: 0.5rem;
}

.btn-secondary {
    padding: 0.5rem 1rem;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-secondary:disabled {
    background-color: #adb5bd;
    cursor: not-allowed;
}

.btn-secondary:hover:not(:disabled) {
    background-color: #545b62;
}

.btn-outline {
    padding: 0.5rem 1rem;
    background-color: transparent;
    color: #007bff;
    border: 1px solid #007bff;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-outline:disabled {
    color: #6c757d;
    border-color: #6c757d;
    cursor: not-allowed;
}

.btn-outline:hover:not(:disabled) {
    background-color: #007bff;
    color: white;
}

.notifications-content {
    padding: 2rem;
}

.notifications-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.notification-item {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    transition: all 0.2s;
}

.notification-item:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.notification-item.unread {
    border-left: 4px solid #007bff;
    background-color: #e3f2fd;
}

.notification-content {
    display: flex;
    gap: 1rem;
}

.notification-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
}

.notification-text {
    flex: 1;
}

.notification-text h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
}

.notification-text p {
    margin: 0 0 0.5rem 0;
    color: #666;
    line-height: 1.4;
}

.notification-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    color: #666;
}

.notification-type {
    background-color: #007bff;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
}

.notification-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
}

.btn-small {
    padding: 0.25rem 0.5rem;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 0.8rem;
}

.btn-small:hover {
    background-color: #545b62;
}

.btn-danger {
    background-color: #dc3545;
}

.btn-danger:hover {
    background-color: #c82333;
}

.loading,
.empty-state {
    text-align: center;
    padding: 2rem;
    color: #666;
}
</style>
