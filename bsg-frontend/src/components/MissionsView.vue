<template>
    <div class="missions-container">
        <h2>Missions</h2>

        <div class="missions-header">
            <button @click="showCreateForm = !showCreateForm" class="btn btn-primary">
                {{ showCreateForm ? 'Annuler' : 'Créer une nouvelle mission' }}
            </button>
        </div>

        <!-- Formulaire de création de mission -->
        <div v-if="showCreateForm" class="mission-form">
            <h3>Créer une nouvelle mission</h3>
            <form @submit.prevent="createMission">
                <div class="form-group">
                    <label for="missionTitle">Titre:</label>
                    <input id="missionTitle" v-model="newMission.title" type="text" required class="form-input" />
                </div>

                <div class="form-group">
                    <label for="missionDescription">Description:</label>
                    <textarea id="missionDescription" v-model="newMission.description" required
                        class="form-textarea"></textarea>
                </div>

                <div class="form-group">
                    <label for="missionDifficulty">Difficulté:</label>
                    <select id="missionDifficulty" v-model="newMission.difficulty" required class="form-select">
                        <option value="Facile">Facile</option>
                        <option value="Moyen">Moyen</option>
                        <option value="Difficile">Difficile</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="missionObjectives">Objectifs (séparés par des virgules):</label>
                    <input id="missionObjectives" v-model="newMission.objectives" type="text" class="form-input" />
                </div>

                <div class="form-group">
                    <label for="missionHints">Indices:</label>
                    <textarea id="missionHints" v-model="newMission.hints" class="form-textarea"></textarea>
                </div>

                <button type="submit" class="btn btn-success">Créer la mission</button>
            </form>
        </div>

        <div v-if="loading" class="loading">Chargement...</div>

        <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
        </div>

        <div class="missions-grid">
            <div v-for="mission in missions" :key="mission.id" class="mission-card">
                <div class="mission-header">
                    <h3>{{ mission.titre }}</h3>
                    <span class="difficulty-badge" :class="mission.difficulte.toLowerCase()">
                        {{ mission.difficulte }}
                    </span>
                </div>

                <div class="mission-content">
                    <p class="mission-description">{{ mission.description }}</p>

                    <div v-if="mission.objectifs" class="mission-section">
                        <h4>Objectifs:</h4>
                        <ul>
                            <li v-for="(objective, index) in mission.objectifs.split(',')" :key="index">
                                {{ objective.trim() }}
                            </li>
                        </ul>
                    </div>

                    <div v-if="mission.indices" class="mission-section">
                        <h4>Indices:</h4>
                        <p>{{ mission.indices }}</p>
                    </div>

                    <div class="mission-meta">
                        <p><strong>Créé le:</strong> {{ formatDate(mission.createdAt) }}</p>
                    </div>
                </div>

                <div class="mission-actions">
                    <button @click="startMission(mission.id)" class="btn btn-primary">Commencer</button>
                    <button @click="viewMissionDetails(mission.id)" class="btn btn-secondary">Détails</button>
                </div>
            </div>
        </div>

        <div v-if="!loading && !errorMessage && missions.length === 0" class="no-missions">
            Aucune mission disponible.
        </div>
    </div>
</template>

<script>
import { api } from '../utils/api'

export default {
    name: 'MissionsView',
    data() {
        return {
            missions: [],
            loading: false,
            errorMessage: '',
            showCreateForm: false,
            newMission: {
                title: '',
                description: '',
                difficulty: 'Facile',
                objectives: '',
                hints: ''
            }
        }
    },
    methods: {
        // Récupération des missions depuis l'API
        async fetchMissions() {
            try {
                this.loading = true
                this.errorMessage = ''

                const response = await api.getMissions()
                this.missions = response.map(mission => ({
                    ...mission,
                    objectifs: mission.objectifs || '',
                    indices: mission.indices || ''
                }))

            } catch (error) {
                console.error('Erreur lors de la récupération des missions:', error)
                this.errorMessage = 'Erreur lors de la récupération des missions'
            } finally {
                this.loading = false
            }
        },

        // Création d'une nouvelle mission
        async createMission() {
            try {
                const missionData = {
                    titre: this.newMission.title,
                    description: this.newMission.description,
                    difficulte: this.newMission.difficulty,
                    objectifs: this.newMission.objectives,
                    indices: this.newMission.hints
                }

                await api.createMission(missionData)

                // Réinitialisation du formulaire
                this.newMission = {
                    title: '',
                    description: '',
                    difficulty: 'Facile',
                    objectives: '',
                    hints: ''
                }

                this.showCreateForm = false

                // Rafraîchissement de la liste des missions
                await this.fetchMissions()

            } catch (error) {
                console.error('Erreur lors de la création de la mission:', error)
                this.errorMessage = 'Erreur lors de la création de la mission'
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
        }
    },
    mounted() {
        this.fetchMissions()
    }
}
</script>

<style scoped>
.missions-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.missions-header {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.mission-form {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.mission-form h3 {
    margin-top: 0;
    color: #007bff;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.form-input,
.form-textarea,
.form-select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
}

.form-textarea {
    height: 100px;
    resize: vertical;
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

.btn-success {
    background-color: #28a745;
    color: white;
}

.btn-secondary {
    background-color: #6c757d;
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

.missions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 20px;
}

.mission-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.mission-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
}

.mission-header h3 {
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

.mission-section h4 {
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

.no-missions {
    text-align: center;
    padding: 40px;
    color: #6c757d;
    font-style: italic;
}

@media (max-width: 768px) {
    .missions-grid {
        grid-template-columns: 1fr;
    }

    .missions-header {
        flex-direction: column;
        gap: 10px;
    }

    .mission-actions {
        flex-direction: column;
    }
}
</style>
