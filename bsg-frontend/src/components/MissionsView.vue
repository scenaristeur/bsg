<template>
    <div class="missions-view">
        <h2>Missions</h2>
        <GenerateMissionButton />

        <div class="missions-list">
            <h3>Missions en cours</h3>
            <div v-if="loading" class="loading">Chargement...</div>

            <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
            </div>

            <div v-if="!loading && !errorMessage && userMissions.length === 0" class="no-missions">
                Aucune mission en cours.
            </div>

            <div v-for="mission in userMissions" :key="mission.id" class="mission-card">
                <div class="mission-header">
                    <h4>{{ mission.titre }}</h4>
                    <span class="difficulty-badge" :class="mission.difficulte.toLowerCase()">
                        {{ mission.difficulte }}
                    </span>
                </div>

                <div class="mission-content">
                    <p class="mission-description">{{ mission.description }}</p>

                    <div v-if="mission.objectifs" class="mission-section">
                        <h5>Objectifs:</h5>
                        <ul>
                            <li v-for="(objective, index) in mission.objectifs.split(',')" :key="index">
                                {{ objective.trim() }}
                            </li>
                        </ul>
                    </div>

                    <div v-if="mission.indices" class="mission-section">
                        <h5>Indices:</h5>
                        <p>{{ mission.indices }}</p>
                    </div>

                    <div class="mission-meta">
                        <p><strong>Créée le:</strong> {{ formatDate(mission.createdAt) }}</p>
                        <p><strong>Statut:</strong> {{ mission.statut }}</p>
                    </div>
                </div>

                <div class="mission-actions">
                    <button @click="startMission(mission.id)" class="btn btn-primary">Commencer</button>
                    <button @click="viewMissionDetails(mission.id)" class="btn btn-secondary">Détails</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import GenerateMissionButton from './GenerateMissionButton.vue'
import { useUserStore } from '@/stores/user'
import { api } from '../utils/api'
import { io } from 'socket.io-client'

export default {
    name: 'MissionsView',
    components: {
        GenerateMissionButton
    },
    setup() {
        const userMissions = ref([])
        const loading = ref(false)
        const errorMessage = ref('')
        const userStore = useUserStore()
        const socket = ref(null)

        // Récupération des missions de l'utilisateur
        const fetchUserMissions = async () => {
            if (!userStore.currentUser) return

            try {
                loading.value = true
                errorMessage.value = ''

                // Utilisation de l'API existante
                const response = await api.getMissions()
                // Filtrer les missions pour ne garder que celles de l'utilisateur
                userMissions.value = response.filter(mission =>
                    mission.assignee && mission.assignee.user_id === userStore.currentUser.id
                )
            } catch (error) {
                console.error('Erreur lors de la récupération des missions de l\'utilisateur:', error)
                errorMessage.value = 'Erreur lors de la récupération des missions'
            } finally {
                loading.value = false
            }
        }

        // Formatage de la date
        const formatDate = (dateString) => {
            if (!dateString) return 'Inconnue'
            const date = new Date(dateString)
            return date.toLocaleDateString('fr-FR')
        }

        // Commencer une mission
        const startMission = (missionId) => {
            console.log('Commencer la mission:', missionId)
            // Ici, vous pouvez rediriger vers la page de détails de la mission
        }

        // Voir les détails d'une mission
        const viewMissionDetails = (missionId) => {
            console.log('Voir les détails de la mission:', missionId)
            // Ici, vous pouvez rediriger vers la page de détails de la mission
        }

        // Initialisation du WebSocket
        const initWebSocket = () => {
            if (!userStore.currentUser) return

            socket.value = io('http://localhost:3000', {
                transports: ['websocket']
            })

            // Connexion au salon de l'utilisateur
            socket.value.emit('joinRoom', `user_${userStore.currentUser.id}`)

            // Écoute des notifications de nouvelles missions
            socket.value.on('missionCreated', (data) => {
                console.log('Nouvelle mission créée:', data)
                // Rafraîchir la liste des missions
                fetchUserMissions()
            })

            socket.value.on('connect', () => {
                console.log('Connecté au serveur WebSocket')
            })

            socket.value.on('disconnect', () => {
                console.log('Déconnecté du serveur WebSocket')
            })
        }

        // Nettoyage des ressources WebSocket
        const cleanupWebSocket = () => {
            if (socket.value) {
                socket.value.disconnect()
            }
        }

        // Montage du composant
        onMounted(() => {
            if (userStore.currentUser) {
                fetchUserMissions()
                initWebSocket()
            }
        })

        // Démontage du composant
        onUnmounted(() => {
            cleanupWebSocket()
        })

        return {
            userMissions,
            loading,
            errorMessage,
            formatDate,
            startMission,
            viewMissionDetails
        }
    }
}
</script>

<style scoped>
.missions-view {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
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
</content>
