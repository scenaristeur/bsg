<template>
    <div class="map-container">
        <h2>Carte des Rencontres</h2>

        <div class="map-controls">
            <div class="filter-section">
                <label for="meetingType">Type de rencontre:</label>
                <select id="meetingType" v-model="filters.meetingType" class="filter-select">
                    <option value="">Tous les types</option>
                    <option value="rendez-vous">Rendez-vous</option>
                    <option value="discussion">Discussion</option>
                    <option value="mission">Mission</option>
                </select>
            </div>

            <div class="filter-section">
                <label for="meetingStatus">Statut:</label>
                <select id="meetingStatus" v-model="filters.status" class="filter-select">
                    <option value="">Tous les statuts</option>
                    <option value="confirmée">Confirmée</option>
                    <option value="en attente">En attente</option>
                    <option value="annulée">Annulée</option>
                </select>
            </div>

            <button @click="refreshMeetings" class="btn btn-primary">Actualiser</button>
        </div>

        <div v-if="loading" class="loading">Chargement...</div>

        <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
        </div>

        <div class="map-wrapper">
            <!-- Ici, nous utiliserions une bibliothèque de carte comme Leaflet ou Google Maps -->
            <div class="mock-map">
                <p class="map-placeholder">Carte interactive (simulation)</p>
                <div class="map-markers">
                    <div v-for="meeting in filteredMeetings" :key="meeting.id" class="map-marker"
                        :style="getMarkerStyle(meeting)" @click="viewMeetingDetails(meeting)">
                        <div class="marker-content">
                            <div class="marker-avatar">
                                {{ getParticipantInitial(meeting) }}
                            </div>
                            <div class="marker-info">
                                <div class="marker-title">{{ meeting.type }}</div>
                                <div class="marker-date">{{ formatDate(meeting.date) }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="meetings-list">
            <h3>Liste des rencontres</h3>
            <div v-for="meeting in filteredMeetings" :key="meeting.id" class="meeting-item"
                @click="viewMeetingDetails(meeting)">
                <div class="meeting-info">
                    <div class="meeting-title">{{ meeting.type }}</div>
                    <div class="meeting-participants">
                        {{ getParticipantName(meeting) }}
                    </div>
                    <div class="meeting-location">{{ meeting.lieu }}</div>
                    <div class="meeting-date">{{ formatDate(meeting.date) }}</div>
                </div>
                <div class="meeting-status" :class="meeting.statut">
                    {{ getStatusLabel(meeting.statut) }}
                </div>
            </div>
        </div>

        <div v-if="!loading && !errorMessage && filteredMeetings.length === 0" class="no-meetings">
            Aucune rencontre disponible.
        </div>
    </div>
</template>

<script>
import { api } from '../utils/api'

export default {
    name: 'MapView',
    data() {
        return {
            meetings: [],
            loading: false,
            errorMessage: '',
            filters: {
                meetingType: '',
                status: ''
            }
        }
    },
    computed: {
        filteredMeetings() {
            return this.meetings.filter(meeting => {
                const matchesType = !this.filters.meetingType || meeting.type === this.filters.meetingType
                const matchesStatus = !this.filters.status || meeting.statut === this.filters.status
                return matchesType && matchesStatus
            })
        }
    },
    methods: {
        // Récupération des rencontres depuis l'API
        async fetchMeetings() {
            try {
                this.loading = true
                this.errorMessage = ''

                const response = await api.getEncounters()
                this.meetings = response

            } catch (error) {
                console.error('Erreur lors de la récupération des rencontres:', error)
                this.errorMessage = 'Erreur lors de la récupération des rencontres'
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

        // Récupération du libellé du statut
        getStatusLabel(status) {
            switch (status) {
                case 'confirmée':
                    return 'Confirmée'
                case 'en attente':
                    return 'En attente'
                case 'annulée':
                    return 'Annulée'
                default:
                    return status
            }
        },

        // Récupération du nom du participant
        getParticipantName(meeting) {
            // Dans une application réelle, vous auriez besoin de récupérer les détails des utilisateurs
            return `Utilisateur ${meeting.userId1} ↔ Utilisateur ${meeting.userId2}`
        },

        // Récupération de la première lettre du nom du participant
        getParticipantInitial(meeting) {
            return 'U'
        },

        // Style du marqueur sur la carte
        getMarkerStyle(meeting) {
            // Position aléatoire pour la simulation
            const left = Math.random() * 80 + 10
            const top = Math.random() * 80 + 10

            return {
                position: 'absolute',
                left: `${left}%`,
                top: `${top}%`,
                transform: 'translate(-50%, -50%)'
            }
        },

        // Voir les détails d'une rencontre
        viewMeetingDetails(meeting) {
            console.log('Voir les détails de la rencontre:', meeting.id)
            // Ici, vous pouvez rediriger vers la page de détails de la rencontre
        },

        // Actualiser les rencontres
        refreshMeetings() {
            this.fetchMeetings()
        }
    },
    mounted() {
        this.fetchMeetings()
    }
}
</script>

<style scoped>
.map-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.map-controls {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    align-items: end;
}

.filter-section {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 200px;
}

.filter-section label {
    margin-bottom: 5px;
    font-weight: bold;
    font-size: 14px;
}

.filter-select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.btn {
    padding: 8px 16px;
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

.map-wrapper {
    margin-bottom: 30px;
    position: relative;
    height: 500px;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
}

.mock-map {
    width: 100%;
    height: 100%;
    background-color: #e9ecef;
    position: relative;
}

.map-placeholder {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #6c757d;
    font-style: italic;
}

.map-markers {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.map-marker {
    cursor: pointer;
    z-index: 10;
}

.marker-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border-radius: 8px;
    padding: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    min-width: 120px;
    border: 2px solid #007bff;
}

.marker-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #007bff;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 4px;
}

.marker-info {
    text-align: center;
    font-size: 12px;
}

.marker-title {
    font-weight: bold;
    margin-bottom: 2px;
}

.marker-date {
    color: #6c757d;
    font-size: 10px;
}

.meetings-list {
    margin-top: 20px;
}

.meetings-list h3 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #007bff;
}

.meeting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 10px;
    background-color: #f9f9f9;
    cursor: pointer;
    transition: background-color 0.2s;
}

.meeting-item:hover {
    background-color: #e9ecef;
}

.meeting-info {
    flex: 1;
}

.meeting-title {
    font-weight: bold;
    margin-bottom: 5px;
    color: #007bff;
}

.meeting-participants {
    font-size: 12px;
    color: #6c757d;
    margin-bottom: 3px;
}

.meeting-location {
    font-size: 12px;
    color: #6c757d;
    margin-bottom: 3px;
}

.meeting-date {
    font-size: 11px;
    color: #6c757d;
}

.meeting-status {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
}

.meeting-status.confirmée {
    background-color: #d4edda;
    color: #155724;
}

.meeting-status.en_attente {
    background-color: #fff3cd;
    color: #856404;
}

.meeting-status.annulée {
    background-color: #f8d7da;
    color: #721c24;
}

.no-meetings {
    text-align: center;
    padding: 40px;
    color: #6c757d;
    font-style: italic;
}

@media (max-width: 768px) {
    .map-controls {
        flex-direction: column;
    }

    .meeting-item {
        flex-direction: column;
        align-items: flex-start;
    }

    .meeting-status {
        margin-top: 10px;
    }
}
</style>
