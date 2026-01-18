<template>
    <div class="mission-detail">
        <header class="mission-header">
            <button @click="$router.back()" class="back-btn">
                ← Retour
            </button>
            <h1>{{ mission?.titre || 'Détails de la mission' }}</h1>
            <div class="mission-status">
                <span :class="['status-badge', mission?.statut]">
                    {{ getStatusLabel(mission?.statut) }}
                </span>
            </div>
        </header>

        <div class="mission-content">
            <!-- Informations générales -->
            <section class="mission-info">
                <div class="info-grid">
                    <div class="info-item">
                        <h3>Difficulté</h3>
                        <p>{{ mission?.difficulte || 'Non définie' }}</p>
                    </div>
                    <div class="info-item">
                        <h3>Objectifs</h3>
                        <p>{{ mission?.objectifs || 'Aucun objectif défini' }}</p>
                    </div>
                    <div class="info-item">
                        <h3>Indices</h3>
                        <p>{{ mission?.indices || 'Aucun indice disponible' }}</p>
                    </div>
                </div>
            </section>

            <!-- Description -->
            <section class="mission-description">
                <h2>Description</h2>
                <p>{{ mission?.description || 'Aucune description disponible.' }}</p>
            </section>

            <!-- Étapes de la mission -->
            <section class="mission-steps">
                <h2>Étapes de la mission</h2>
                <div v-if="loadingSteps" class="loading">
                    Chargement des étapes...
                </div>
                <div v-else-if="steps.length === 0" class="empty-state">
                    Aucune étape disponible pour cette mission.
                </div>
                <div v-else class="steps-list">
                    <div v-for="(step, index) in steps" :key="step.id"
                        :class="['step-item', { completed: step.completed }]">
                        <div class="step-header">
                            <span class="step-number">{{ index + 1 }}</span>
                            <h3>{{ step.titre }}</h3>
                            <span class="step-status" :class="step.status">
                                {{ getStepStatusLabel(step.status) }}
                            </span>
                        </div>
                        <div class="step-content">
                            <p>{{ step.description }}</p>
                            <div class="step-actions">
                                <button v-if="!step.completed" @click="completeStep(step.id)" class="btn-primary">
                                    Marquer comme terminé
                                </button>
                                <button v-else @click="undoStep(step.id)" class="btn-outline">
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Objets partagés -->
            <section class="shared-objects" v-if="hasSharedObjects">
                <h2>Objets partagés</h2>
                <div class="objects-grid">
                    <div v-for="obj in sharedObjects" :key="obj.id" class="object-card">
                        <div class="object-icon">
                            <span>🔑</span>
                        </div>
                        <div class="object-info">
                            <h3>{{ obj.nom }}</h3>
                            <p class="object-description">{{ obj.description }}</p>
                            <p class="object-status">
                                <span :class="['status-badge', obj.statut]">
                                    {{ getObjectStatusLabel(obj.statut) }}
                                </span>
                            </p>
                        </div>
                        <div class="object-actions">
                            <button @click="useObject(obj.id)" :disabled="obj.statut !== 'disponible'"
                                class="btn-secondary">
                                Utiliser
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Actions de la mission -->
            <section class="mission-actions">
                <div class="action-buttons">
                    <button v-if="mission?.statut === 'initie'" @click="startMission" class="btn-primary">
                        Commencer la mission
                    </button>
                    <button v-if="mission?.statut === 'en_cours'" @click="completeMission" class="btn-success">
                        Terminer la mission
                    </button>
                    <button v-if="mission?.statut === 'termine'" @click="restartMission" class="btn-secondary">
                        Recommencer la mission
                    </button>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
    name: 'MissionDetail',
    props: {
        missionId: {
            type: [String, Number],
            required: true
        }
    },
    data() {
        return {
            loadingSteps: false,
            steps: [],
            sharedObjects: []
        }
    },
    computed: {
        ...mapState('missions', ['activeMissions', 'completedMissions']),
        ...mapGetters('missions', ['activeMissions', 'completedMissions']),
        mission() {
            // Trouver la mission dans les missions actives ou complétées
            return this.activeMissions.find(m => m.id == this.missionId) ||
                this.completedMissions.find(m => m.id == this.missionId)
        },
        hasSharedObjects() {
            return this.sharedObjects && this.sharedObjects.length > 0
        }
    },
    async mounted() {
        await this.loadMissionSteps()
        await this.loadSharedObjects()
    },
    methods: {
        ...mapActions('missions', [
            'updateMissionStatus',
            'updateMissionProgress'
        ]),

        async loadMissionSteps() {
            this.loadingSteps = true
            try {
                // Simuler le chargement des étapes
                this.steps = [
                    {
                        id: 1,
                        titre: 'Première étape',
                        description: 'Description de la première étape',
                        status: 'en_attente',
                        completed: false
                    },
                    {
                        id: 2,
                        titre: 'Deuxième étape',
                        description: 'Description de la deuxième étape',
                        status: 'en_attente',
                        completed: false
                    },
                    {
                        id: 3,
                        titre: 'Troisième étape',
                        description: 'Description de la troisième étape',
                        status: 'en_attente',
                        completed: false
                    }
                ]
            } catch (error) {
                console.error('Erreur lors du chargement des étapes:', error)
            } finally {
                this.loadingSteps = false
            }
        },

        async loadSharedObjects() {
            try {
                // Simuler le chargement des objets partagés
                this.sharedObjects = [
                    {
                        id: 1,
                        nom: 'Clé ancienne',
                        description: 'Une clé qui semble importante',
                        statut: 'disponible'
                    },
                    {
                        id: 2,
                        nom: 'Carte au trésor',
                        description: 'Une carte indiquant un lieu mystérieux',
                        statut: 'utilise'
                    }
                ]
            } catch (error) {
                console.error('Erreur lors du chargement des objets:', error)
            }
        },

        async startMission() {
            try {
                const result = await this.updateMissionStatus({
                    missionId: this.missionId,
                    status: 'en_cours'
                })
                if (result.success) {
                    this.$router.push(`/missions/${this.missionId}/start`)
                }
            } catch (error) {
                console.error('Erreur lors du démarrage de la mission:', error)
            }
        },

        async completeMission() {
            try {
                const result = await this.updateMissionStatus({
                    missionId: this.missionId,
                    status: 'termine'
                })
                if (result.success) {
                    // Afficher une notification
                    this.$emit('mission-completed')
                }
            } catch (error) {
                console.error('Erreur lors de la completion de la mission:', error)
            }
        },

        async restartMission() {
            try {
                const result = await this.updateMissionStatus({
                    missionId: this.missionId,
                    status: 'initie'
                })
                if (result.success) {
                    this.$router.push(`/missions/${this.missionId}`)
                }
            } catch (error) {
                console.error('Erreur lors du redémarrage de la mission:', error)
            }
        },

        async completeStep(stepId) {
            try {
                // Mettre à jour l'étape comme terminée
                const stepIndex = this.steps.findIndex(s => s.id === stepId)
                if (stepIndex !== -1) {
                    this.steps[stepIndex].completed = true
                    this.steps[stepIndex].status = 'termine'

                    // Mettre à jour la progression de la mission
                    const progress = Math.round((this.steps.filter(s => s.completed).length / this.steps.length) * 100)
                    await this.updateMissionProgress({
                        missionId: this.missionId,
                        progress: progress
                    })
                }
            } catch (error) {
                console.error('Erreur lors de la completion de l\'étape:', error)
            }
        },

        async undoStep(stepId) {
            try {
                // Remettre l'étape à son état initial
                const stepIndex = this.steps.findIndex(s => s.id === stepId)
                if (stepIndex !== -1) {
                    this.steps[stepIndex].completed = false
                    this.steps[stepIndex].status = 'en_attente'

                    // Mettre à jour la progression de la mission
                    const progress = Math.round((this.steps.filter(s => s.completed).length / this.steps.length) * 100)
                    await this.updateMissionProgress({
                        missionId: this.missionId,
                        progress: progress
                    })
                }
            } catch (error) {
                console.error('Erreur lors de l\'annulation de l\'étape:', error)
            }
        },

        async useObject(objectId) {
            try {
                // Simuler l'utilisation d'un objet
                const objectIndex = this.sharedObjects.findIndex(o => o.id === objectId)
                if (objectIndex !== -1) {
                    this.sharedObjects[objectIndex].statut = 'utilise'
                }
            } catch (error) {
                console.error('Erreur lors de l\'utilisation de l\'objet:', error)
            }
        },

        getStatusLabel(status) {
            const labels = {
                'initie': 'Initiée',
                'en_cours': 'En cours',
                'termine': 'Terminée'
            }
            return labels[status] || status
        },

        getStepStatusLabel(status) {
            const labels = {
                'en_attente': 'En attente',
                'en_cours': 'En cours',
                'termine': 'Terminé'
            }
            return labels[status] || status
        },

        getObjectStatusLabel(status) {
            const labels = {
                'disponible': 'Disponible',
                'utilise': 'Utilisé'
            }
            return labels[status] || status
        }
    }
}
</script>

<style scoped>
.mission-detail {
    min-height: 100vh;
    background-color: #f8f9fa;
}

.mission-header {
    background-color: #fff;
    padding: 1rem 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.back-btn {
    padding: 0.5rem 1rem;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.back-btn:hover {
    background-color: #545b62;
}

.mission-header h1 {
    margin: 0;
    color: #333;
    flex: 1;
    text-align: center;
    margin: 0 1rem;
}

.mission-status {
    margin-left: 1rem;
}

.status-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
}

.status-badge.initie {
    background-color: #ffc107;
    color: #212529;
}

.status-badge.en_cours {
    background-color: #17a2b8;
    color: white;
}

.status-badge.termine {
    background-color: #28a745;
    color: white;
}

.mission-content {
    padding: 2rem;
}

.mission-info {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.info-item h3 {
    margin: 0 0 0.5rem 0;
    color: #666;
    font-size: 1rem;
}

.info-item p {
    margin: 0;
    color: #333;
}

.mission-description {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
}

.mission-description h2 {
    margin: 0 0 1rem 0;
    color: #333;
}

.mission-description p {
    margin: 0;
    color: #666;
    line-height: 1.6;
}

.mission-steps {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
}

.mission-steps h2 {
    margin: 0 0 1rem 0;
    color: #333;
}

.steps-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.step-item {
    border: 1px solid #eee;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.2s;
}

.step-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.step-item.completed {
    opacity: 0.7;
    border-color: #28a745;
}

.step-header {
    display: flex;
    align-items: center;
    padding: 1rem;
    background-color: #f8f9fa;
    border-bottom: 1px solid #eee;
}

.step-number {
    background-color: #007bff;
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    font-weight: bold;
}

.step-header h3 {
    margin: 0 1rem 0 0;
    flex: 1;
}

.step-status {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
}

.step-status.en_attente {
    background-color: #ffc107;
    color: #212529;
}

.step-status.en_cours {
    background-color: #17a2b8;
    color: white;
}

.step-status.termine {
    background-color: #28a745;
    color: white;
}

.step-content {
    padding: 1rem;
}

.step-content p {
    margin: 0 0 1rem 0;
    color: #666;
}

.step-actions {
    display: flex;
    justify-content: flex-end;
}

.shared-objects {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
}

.shared-objects h2 {
    margin: 0 0 1rem 0;
    color: #333;
}

.objects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

.object-card {
    display: flex;
    border: 1px solid #eee;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.2s;
}

.object-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.object-icon {
    background-color: #007bff;
    color: white;
    width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
}

.object-info {
    flex: 1;
    padding: 1rem;
}

.object-info h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
}

.object-description {
    margin: 0 0 0.5rem 0;
    color: #666;
    font-size: 0.9rem;
}

.object-status {
    margin: 0;
}

.object-actions {
    padding: 1rem;
    display: flex;
    align-items: center;
}

.mission-actions {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.btn-primary {
    padding: 0.75rem 1.5rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 1rem;
}

.btn-primary:hover {
    background-color: #0056b3;
}

.btn-success {
    padding: 0.75rem 1.5rem;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 1rem;
}

.btn-success:hover {
    background-color: #1e7e34;
}

.btn-secondary {
    padding: 0.75rem 1.5rem;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 1rem;
}

.btn-secondary:hover {
    background-color: #545b62;
}

.btn-outline {
    padding: 0.75rem 1.5rem;
    background-color: transparent;
    color: #007bff;
    border: 1px solid #007bff;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 1rem;
}

.btn-outline:hover {
    background-color: #007bff;
    color: white;
}

.loading,
.empty-state {
    text-align: center;
    padding: 2rem;
    color: #666;
}
</style>
