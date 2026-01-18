<template>
    <div class="profile">
        <header class="profile-header">
            <h1>Mon Profil</h1>
        </header>

        <div class="profile-content">
            <!-- Informations personnelles -->
            <section class="profile-section">
                <h2>Informations Personnelles</h2>
                <div class="profile-grid">
                    <div class="profile-item">
                        <label>Nom d'utilisateur</label>
                        <p>{{ userProfile?.pseudo || 'Non défini' }}</p>
                    </div>
                    <div class="profile-item">
                        <label>Nom</label>
                        <p>{{ userProfile?.nom || 'Non défini' }}</p>
                    </div>
                    <div class="profile-item">
                        <label>Prénom</label>
                        <p>{{ userProfile?.prenom || 'Non défini' }}</p>
                    </div>
                    <div class="profile-item">
                        <label>Email</label>
                        <p>{{ userProfile?.email || 'Non défini' }}</p>
                    </div>
                    <div class="profile-item">
                        <label>Date d'inscription</label>
                        <p>{{ formatDate(userProfile?.created_at) || 'Non défini' }}</p>
                    </div>
                </div>
            </section>

            <!-- Compétences -->
            <section class="profile-section">
                <h2>Compétences</h2>
                <div class="skills-container">
                    <div v-for="skill in skills" :key="skill.id" class="skill-tag">
                        {{ skill.name }}
                    </div>
                </div>
            </section>

            <!-- Historique des missions -->
            <section class="profile-section">
                <h2>Historique des Missions</h2>
                <div v-if="loadingHistory" class="loading">
                    Chargement de l'historique...
                </div>
                <div v-else-if="completedMissions.length === 0" class="empty-state">
                    Aucune mission terminée pour le moment.
                </div>
                <div v-else class="history-list">
                    <div v-for="mission in completedMissions" :key="mission.id" class="history-item">
                        <div class="history-header">
                            <h3>{{ mission.titre }}</h3>
                            <span class="history-date">{{ formatDate(mission.created_at) }}</span>
                        </div>
                        <p class="history-description">{{ mission.description }}</p>
                        <div class="history-meta">
                            <span class="difficulty">{{ mission.difficulte }}</span>
                            <span class="status">Terminée</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Statistiques -->
            <section class="profile-section">
                <h2>Statistiques</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>{{ totalMissions }}</h3>
                        <p>Missions totales</p>
                    </div>
                    <div class="stat-card">
                        <h3>{{ completedMissionCount }}</h3>
                        <p>Missions terminées</p>
                    </div>
                    <div class="stat-card">
                        <h3>{{ activeMissionCount }}</h3>
                        <p>Missions actives</p>
                    </div>
                    <div class="stat-card">
                        <h3>{{ totalXP }}</h3>
                        <p>Points d'expérience</p>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
    name: 'Profile',
    data() {
        return {
            loadingHistory: false,
            skills: [
                { id: 1, name: 'Exploration' },
                { id: 2, name: 'Communication' },
                { id: 3, name: 'Résolution de problèmes' },
                { id: 4, name: 'Créativité' }
            ]
        }
    },
    computed: {
        ...mapState('auth', ['user']),
        ...mapGetters('auth', ['currentUser']),
        ...mapGetters('missions', [
            'activeMissions',
            'completedMissions',
            'activeMissionCount',
            'completedMissionCount',
            'totalMissions'
        ]),
        userProfile() {
            return this.currentUser || this.user
        },
        totalXP() {
            // Simuler le calcul des points d'expérience
            return this.completedMissions.length * 100
        }
    },
    async mounted() {
        await this.loadUserHistory()
    },
    methods: {
        ...mapActions('missions', ['loadUserMissions']),

        async loadUserHistory() {
            this.loadingHistory = true
            try {
                // Simuler le chargement de l'historique des missions
                await this.loadUserMissions(this.user?.id)
            } catch (error) {
                console.error('Erreur lors du chargement de l\'historique:', error)
            } finally {
                this.loadingHistory = false
            }
        },

        formatDate(dateString) {
            if (!dateString) return 'Non défini'
            const date = new Date(dateString)
            return date.toLocaleDateString('fr-FR')
        }
    }
}
</script>

<style scoped>
.profile {
    min-height: 100vh;
    background-color: #f8f9fa;
}

.profile-header {
    background-color: #fff;
    padding: 1rem 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-header h1 {
    margin: 0;
    color: #333;
}

.profile-content {
    padding: 2rem;
}

.profile-section {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
}

.profile-section h2 {
    margin: 0 0 1rem 0;
    color: #333;
}

.profile-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

.profile-item {
    margin-bottom: 1rem;
}

.profile-item label {
    display: block;
    margin-bottom: 0.25rem;
    font-weight: bold;
    color: #666;
}

.profile-item p {
    margin: 0;
    color: #333;
}

.skills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.skill-tag {
    background-color: #007bff;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
}

.history-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.history-item {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 1rem;
    transition: all 0.2s;
}

.history-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.history-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;
}

.history-header h3 {
    margin: 0;
    color: #333;
}

.history-date {
    color: #666;
    font-size: 0.9rem;
}

.history-description {
    margin: 0 0 0.5rem 0;
    color: #666;
}

.history-meta {
    display: flex;
    gap: 0.5rem;
}

.difficulty {
    background-color: #ffc107;
    color: #212529;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
}

.status {
    background-color: #28a745;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
}

.stat-card {
    background-color: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
    margin: 0 0 0.5rem 0;
    color: #007bff;
    font-size: 1.5rem;
}

.stat-card p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
}

.loading,
.empty-state {
    text-align: center;
    padding: 2rem;
    color: #666;
}
</style>
