<template>
    <div class="notifications-view">
        <h2>Notifications de Rencontre</h2>
        <div class="notification-card" v-if="activeNotification">
            <div class="notification-header">
                <h3>{{ activeNotification.title }}</h3>
                <span class="time">{{ activeNotification.time }}</span>
            </div>
            <div class="notification-details">
                <p><strong>Lieu:</strong> {{ activeNotification.location }}</p>
                <p><strong>Transport:</strong> {{ activeNotification.transport }}</p>
                <p><strong>Arrêt:</strong> {{ activeNotification.stop }}</p>
                <p><strong>Instructions:</strong></p>
                <ul>
                    <li v-for="(instruction, index) in activeNotification.instructions" :key="index">
                        {{ instruction }}
                    </li>
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

        <!-- Section de vérification d'identité -->
        <div class="verification-section" v-if="showVerification">
            <h3>Vérification d'identité</h3>
            <p>Entrez le mot de passe pour valider votre identité :</p>
            <input v-model="verificationPassword" type="password" placeholder="Mot de passe" />
            <button @click="verifyIdentity" class="verify-btn">Vérifier</button>
        </div>

        <!-- Section après vérification -->
        <div class="verification-success" v-if="verifiedPartner">
            <h3>Partenaire identifié</h3>
            <p>Vous avez rencontré {{ verifiedPartner.nom }} {{ verifiedPartner.prenom }}</p>
            <p>Informations cruciales pour la mission :</p>
            <div class="mission-info">
                <p><strong>Indice :</strong> {{ missionInfo }}</p>
            </div>
            <button @click="completeMission" class="complete-btn">Completer la mission</button>
        </div>
    </div>
</template>

<script>
import { userService } from '../../services/userService'

export default {
    name: 'NotificationsView',
    data() {
        return {
            activeNotification: null,
            showVerification: false,
            verificationPassword: '',
            verifiedPartner: null,
            missionInfo: '',
            // Données de test pour le moment
            testNotification: {
                title: "Rendez-vous imminent !",
                time: "18:30",
                location: "Quartier de la Croix-Rousse",
                transport: "Bus 34",
                stop: "Lycée Lumière",
                instructions: [
                    "Direction le fond du bus",
                    "Rechercher un partenaire avec une écharpe bleue",
                    "Utiliser le mot de passe: \"étagère\""
                ]
            }
        }
    },
    mounted() {
        // Simuler le chargement d'une notification depuis le backend
        this.loadNotification()
    },
    methods: {
        async loadNotification() {
            try {
                // Simuler un appel au backend pour obtenir une notification
                // Dans une implémentation réelle, cela viendrait du webhook n8n
                this.activeNotification = this.testNotification
            } catch (error) {
                console.error('Erreur lors du chargement de la notification:', error)
            }
        },
        acceptMeeting() {
            alert('Rendez-vous accepté ! Préparez-vous à rencontrer votre partenaire.')
            // Afficher la section de vérification après acceptation
            this.showVerification = true
        },
        declineMeeting() {
            alert('Rendez-vous refusé.')
            this.activeNotification = null
        },
        verifyIdentity() {
            if (this.verificationPassword === 'étagère') {
                this.verifiedPartner = {
                    nom: 'Martin',
                    prenom: 'Pierre'
                }
                this.missionInfo = 'Le prochain lieu est le musée des Beaux-Arts'
            } else {
                alert('Mot de passe incorrect. Veuillez réessayer.')
            }
        },
        completeMission() {
            alert('Mission complétée ! Félicitations.')
            this.showVerification = false
            this.verifiedPartner = null
            this.verificationPassword = ''
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

.verification-section {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #e9ecef;
    border-radius: 4px;
}

.verification-section input {
    width: 100%;
    padding: 0.5rem;
    margin: 0.5rem 0;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.verify-btn {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.verify-btn:hover {
    background-color: #0056b3;
}

.verification-success {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #d4edda;
    border: 1px solid #c3e6cb;
    border-radius: 4px;
}

.mission-info {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem 0;
}
</style>
