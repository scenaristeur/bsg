<template>
    <div class="missions-view">
        <header class="missions-header">
            <h1>Mes Missions</h1>
            <router-link to="/dashboard" class="btn btn-secondary">
                Retour au tableau de bord
            </router-link>
        </header>

        <div class="missions-content">
            <div class="missions-filters">
                <button @click="filterMissions('all')" :class="{ active: activeFilter === 'all' }">
                    Toutes
                </button>
                <button @click="filterMissions('active')" :class="{ active: activeFilter === 'active' }">
                    Actives
                </button>
                <button @click="filterMissions('completed')" :class="{ active: activeFilter === 'completed' }">
                    Terminées
                </button>
            </div>

            <div class="missions-list">
                <div v-for="mission in filteredMissions" :key="mission.id" class="mission-card">
                    <h3>{{ mission.titre }}</h3>
                    <p class="mission-description">{{ mission.description }}</p>
                    <div class="mission-meta">
                        <span class="difficulty">{{ mission.difficulte }}</span>
                        <span class="progress">
                            Progression: {{ calculateProgress(mission.id) }}%
                        </span>
                    </div>
                    <div class="mission-actions">
                        <button @click="viewMissionDetails(mission.id)" class="btn-outline">
                            Voir détails
                        </button>
                        <button v-if="mission.statut === 'active'" @click="continueMission(mission.id)"
                            class="btn-primary">
                            Continuer
                        </button>
                        <button v-else @click="startMission(mission.id)" class="btn-primary">
                            Commencer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useUserStore } from '../../stores/user'
import { missionService } from '../../services/missionService'
import { io } from 'socket.io-client'

export default {
    name: 'MissionsView',
    data() {
        return {
            userMissions: [],
            loading: false,
            errorMessage: '',
            socket: null
        }
    },
    computed: {
        currentUser() {
            const userStore = useUserStore()
            return userStore.currentUser
        }
    },
    mounted() {
        console.log('MissionsView mounted, currentUser:', this.currentUser)
        if (this.currentUser) {
            console.log('Fetching user missions for:', this.currentUser.id)
            this.fetchUserMissions()
            this.initWebSocket()
        } else {
            console.log('No currentUser found')
        }
    },

    watch: {
        // Surveiller les changements dans les missions
        userMissions: {
            handler(newMissions) {
                console.log('Missions mises à jour dans MissionsView:', newMissions)
            },
            deep: true
        }
    },
    beforeUnmount() {
        this.cleanupWebSocket()
    },
    methods: {
        // Récupération des missions de l'utilisateur
        async fetchUserMissions() {
            if (!this.currentUser) return

            try {
                this.loading = true
                this.errorMessage = ''

                // Utilisation du service pour récupérer les missions
                const missions = await missionService.getUserMissions(this.currentUser.id)
                this.userMissions = missions
            } catch (error) {
                console.error('Erreur lors de la récupération des missions de l\'utilisateur:', error)
                this.errorMessage = 'Erreur lors de la récupération des missions'
            } finally {
                this.loading = false
            }
        },

        // Formatage de la date
        formatDate(dateString) {
            if (!dateString) return 'Inconnue'
            const date = new Date(dateString)
            return date.toLocaleDateString('fr-FR')
        },

        // Commencer une mission
        startMission(missionId) {
            console.log('Commencer la mission:', missionId)
            // Ici, vous pouvez rediriger vers la page de détails de la mission
        },

        // Voir les détails d'une mission
        viewMissionDetails(missionId) {
            console.log('Voir les détails de la mission:', missionId)
            // Ici, vous pouvez rediriger vers la page de détails de la mission
        },

        // Initialisation du WebSocket
        initWebSocket() {
            if (!this.currentUser) return

            this.socket = io('http://localhost:3000', {
                transports: ['websocket'],
                query: {
                    userId: this.currentUser.id
                }
            })

            // Connexion au salon de l'utilisateur
            console.log('Émission joinRoom pour user_', this.currentUser.id)
            this.socket.emit('joinRoom', `user_${this.currentUser.id}`)

            // Écoute des notifications de nouvelles missions
            this.socket.on('missionCreated', (data) => {
                console.log('Nouvelle mission créée (frontend):', data)
                // Afficher une notification discrète
                this.showNotification(data.mission.titre)
                // Rafraîchir la liste des missions
                this.fetchUserMissions()
            })

            this.socket.on('connect', () => {
                console.log('Connecté au serveur WebSocket avec socket ID:', this.socket.id)
                console.log('Connexion avec userId:', this.currentUser.id)
            })

            this.socket.on('disconnect', () => {
                console.log('Déconnecté du serveur WebSocket')
            })
        },

        // Nettoyage des ressources WebSocket
        cleanupWebSocket() {
            if (this.socket) {
                this.socket.disconnect()
            }
        },

        // Affichage d'une notification discrète
        showNotification(titreMission) {
            // Création d'un élément de notification
            const notification = document.createElement('div')
            notification.className = 'toast-notification'
            notification.textContent = `La mission '${titreMission}' est maintenant disponible`

            // Style basique pour la notification
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: #4CAF50;
                color: white;
                padding: 15px 20px;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 1000;
                animation: fadeInOut 3s ease-in-out;
            `

            // Ajout de l'animation CSS
            const style = document.createElement('style')
            style.textContent = `
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translateY(-20px); }
                    10% { opacity: 1; transform: translateY(0); }
                    90% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-20px); }
                }
            `
            document.head.appendChild(style)

            // Ajout à la page
            document.body.appendChild(notification)

            // Suppression automatique après 3 secondes
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification)
                }
                // Supprimer le style après la suppression
                if (style.parentNode) {
                    style.parentNode.removeChild(style)
                }
            }, 3000)
        }
    }
}
</script>

<style scoped>
.missions-view {
    padding: 1rem;
}

.missions-list {
    margin-top: 20px;
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

.no-missions {
    text-align: center;
    padding: 40px;
    color: #6c757d;
    font-style: italic;
}

.mission-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 15px;
}

.mission-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
}

.mission-header h4 {
    margin: 0;
    color: #007bff;
}

.difficulty-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
}

.difficulty-badge.facile {
    background-color: #d4edda;
    color: #155724;
}

.difficulty-badge.moyen {
    background-color: #fff3cd;
    color: #856404;
}

.difficulty-badge.difficile {
    background-color: #f8d7da;
    color: #721c24;
}

.mission-content {
    margin-bottom: 15px;
}

.mission-description {
    margin: 0 0 10px 0;
    font-style: italic;
}

.mission-section {
    margin-bottom: 10px;
}

.mission-section h5 {
    margin: 0 0 5px 0;
    color: #007bff;
}

.mission-section ul {
    margin: 0;
    padding-left: 20px;
}

.mission-meta {
    margin-top: 10px;
    font-size: 12px;
    color: #6c757d;
}

.mission-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

.btn {
    padding: 8px 12px;
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
    .mission-header {
        flex-direction: column;
        gap: 10px;
    }

    .mission-actions {
        flex-direction: column;
    }
}
</style>
