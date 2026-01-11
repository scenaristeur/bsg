<template>
    <div class="notifications-view">
        <h2>Notifications de Rencontre</h2>
        <div class="notification-card" v-if="activeNotification">
            <div class="notification-header">
                <h3>Rendez-vous imminent !</h3>
                <span class="time">{{ activeNotification.time }}</span>
            </div>
            <div class="notification-details">
                <p><strong>Lieu:</strong> {{ activeNotification.lieu }}</p>
                <p><strong>Transport:</strong> {{ activeNotification.transport }}</p>
                <p><strong>Arrêt:</strong> {{ activeNotification.arret }}</p>
                <p><strong>Instructions:</strong></p>
                <ul>
                    <li>Direction le fond du bus</li>
                    <li>Rechercher un partenaire avec une <strong>écharpe bleue</strong></li>
                    <li>Utiliser le mot de passe: <strong>"étagère"</strong></li>
                </ul>
            </div>
            <div class="notification-actions">
                <button @click="acceptMeeting" class="accept-btn">Accepter</button>
                <button @click="declineMeeting" class="decline-btn">Refuser</button>
            </div>
        </div>
        <div v-else class="no-notifications">
            <p>Aucune notification active pour le moment.</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NotificationsView',
    data() {
        return {
            activeNotification: {
                time: '18:30',
                lieu: 'Quartier de la Croix-Rousse',
                transport: 'Bus 34',
                arret: 'Lycée Lumière'
            }
        }
    },
    methods: {
        acceptMeeting() {
            alert('Rendez-vous accepté ! Préparez-vous à rencontrer votre partenaire.')
        },
        declineMeeting() {
            alert('Rendez-vous refusé.')
            this.activeNotification = null
        }
    }
}
</script>

<style scoped>
.notifications-view {
    padding: 1rem;
}

.notification-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    background-color: #f8f9fa;
}

.notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.notification-header h3 {
    margin: 0;
    color: #333;
}

.time {
    background-color: #007bff;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.9rem;
}

.notification-details p {
    margin: 0.5rem 0;
}

.notification-details ul {
    margin: 0.5rem 0;
    padding-left: 1rem;
}

.notification-actions {
    margin-top: 1rem;
    display: flex;
    gap: 0.5rem;
}

.accept-btn,
.decline-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.accept-btn {
    background-color: #28a745;
    color: white;
}

.accept-btn:hover {
    background-color: #218838;
}

.decline-btn {
    background-color: #dc3545;
    color: white;
}

.decline-btn:hover {
    background-color: #c82333;
}

.no-notifications {
    text-align: center;
    padding: 2rem;
    color: #6c757d;
}
</style>
