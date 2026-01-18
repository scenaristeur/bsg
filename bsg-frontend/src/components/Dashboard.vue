<template>
    <div class="dashboard">
        <header class="dashboard-header">
            <h1>Tableau de bord BSG</h1>
            <div class="user-info">
                <span>Bienvenue, {{ currentUser?.pseudo || 'Utilisateur' }}!</span>
                <button @click="logout" class="logout-btn">Déconnexion</button>
            </div>
        </header>

        <main class="dashboard-main">
            <!-- Statistiques principales -->
            <section class="stats-section">
                <div class="stat-card">
                    <h3>Missions Actives</h3>
                    <p class="stat-value">{{ activeMissionCount }}</p>
                </div>
                <div class="stat-card">
                    <h3>Missions Complétées</h3>
                    <p class="stat-value">{{ completedMissionCount }}</p>
                </div>
                <div class="stat-card">
                    <h3>Amis</h3>
                    <p class="stat-value">{{ friendsCount }}</p>
                </div>
                <div class="stat-card">
                    <h3>Notifications</h3>
                    <p class="stat-value">{{ unreadNotifications }}</p>
                </div>
            </section>

            <!-- Section des missions -->
            <section class="missions-section">
                <div class="section-header">
                    <h2>Missions</h2>
                    <button @click="createNewMission" class="btn-primary">
                        Nouvelle Mission
                    </button>
                </div>

                <div v-if="loadingMissions" class="loading">
                    Chargement des missions...
                </div>

                <div v-else-if="activeMissions.length === 0" class="empty-state">
                    <p>Aucune mission active pour le moment.</p>
                    <button @click="createNewMission" class="btn-secondary">
                        Créer une mission
                    </button>
                </div>

                <div v-else class="missions-list">
                    <div v-for="mission in activeMissions" :key="mission.id" class="mission-card">
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
                            <button @click="continueMission(mission.id)" class="btn-primary">
                                Continuer
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Section des interactions sociales -->
            <section class="social-section">
                <div class="section-header">
                    <h2>Activité Sociale</h2>
                </div>

                <div v-if="loadingInteractions" class="loading">
                    Chargement des interactions...
                </div>

                <div v-else-if="interactions.length === 0" class="empty-state">
                    <p>Aucune interaction pour le moment.</p>
                </div>

                <div v-else class="interactions-list">
                    <div v-for="interaction in interactions" :key="interaction.id" class="interaction-item">
                        <div class="interaction-content">
                            <strong>{{ interaction.user_id }}</strong> {{ interaction.message }}
                        </div>
                        <div class="interaction-time">
                            {{ formatDate(interaction.timestamp) }}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
    name: 'Dashboard',
    data() {
        return {
            loadingMissions: false,
            loadingInteractions: false
        }
    },
    computed: {
        ...mapState('auth', ['user']),
        ...mapGetters('auth', ['currentUser']),
        ...mapGetters('missions', [
            'activeMissions',
            'completedMissions',
            'activeMissionCount',
            'completedMissionCount'
        ]),
        ...mapGetters('social', [
            'friends',
            'friendsCount',
            'interactions',
            'unreadNotifications'
        ])
    },
    methods: {
        ...mapActions('auth', ['logout']),
        ...mapActions('missions', ['loadUserMissions']),
        ...mapActions('social', ['loadSocialInteractions']),

        async created() {
            await this.loadUserMissions(this.user?.id)
            await this.loadSocialInteractions(this.user?.id)
        },

        createNewMission() {
            this.$router.push('/missions/new')
        },

        viewMissionDetails(missionId) {
            this.$router.push(`/missions/${missionId}`)
        },

        continueMission(missionId) {
            this.$router.push(`/missions/${missionId}/start`)
        },

        calculateProgress(missionId) {
            // Simuler le calcul de progression
            return Math.floor(Math.random() * 100)
        },

        formatDate(dateString) {
            const date = new Date(dateString)
            return date.toLocaleDateString('fr-FR')
        }
    }
}
</script>

<style scoped>
.dashboard {
    min-height: 100vh;
    background-color: #f8f9fa;
}

.dashboard-header {
    background-color: #fff;
    padding: 1rem 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.dashboard-header h1 {
    margin: 0;
    color: #333;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.logout-btn {
    padding: 0.5rem 1rem;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.logout-btn:hover {
    background-color: #c82333;
}

.dashboard-main {
    padding: 2rem;
}

.stats-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.stat-card h3 {
    margin: 0 0 0.5rem 0;
    color: #666;
    font-size: 1rem;
}

.stat-value {
    margin: 0;
    font-size: 2rem;
    font-weight: bold;
    color: #007bff;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.section-header h2 {
    margin: 0;
    color: #333;
}

.btn-primary {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-primary:hover {
    background-color: #0056b3;
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

.btn-secondary:hover {
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
    margin-right: 0.5rem;
}

.btn-outline:hover {
    background-color: #007bff;
    color: white;
}

.missions-list,
.interactions-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.mission-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.mission-card h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
}

.mission-description {
    margin: 0 0 1rem 0;
    color: #666;
}

.mission-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: #666;
}

.difficulty {
    background-color: #007bff;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
}

.progress {
    background-color: #28a745;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
}

.mission-actions {
    display: flex;
    justify-content: flex-end;
}

.empty-state {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.interaction-item {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.interaction-content {
    flex: 1;
}

.interaction-time {
    color: #666;
    font-size: 0.9rem;
}
</style>
