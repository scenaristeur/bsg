<template>
    <div class="missions-view">
        <h2>Mes Missions</h2>
        <div class="mission-card" v-if="currentMission">
            <div class="mission-header">
                <h3>{{ currentMission.titre }}</h3>
                <span class="difficulty">{{ currentMission.difficulte }}</span>
            </div>
            <div class="mission-description">
                <p>{{ currentMission.description }}</p>
            </div>
            <div class="mission-objectives">
                <h4>Objectifs:</h4>
                <ul>
                    <li v-for="objectif in currentMission.objectifs" :key="objectif">{{ objectif }}</li>
                </ul>
            </div>
            <div class="mission-hints" v-if="currentMission.indices">
                <h4>Indices:</h4>
                <p>{{ currentMission.indices }}</p>
            </div>
            <div class="mission-actions">
                <button @click="startMission" class="start-btn">Commencer la mission</button>
            </div>
        </div>
        <div v-else class="no-missions">
            <p>Aucune mission active pour le moment.</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MissionsView',
    data() {
        return {
            currentMission: {
                titre: 'Le Mystère du Café',
                difficulte: 'Facile',
                description: 'Trouvez l\'indice caché dans le café de la place Bellecour pour découvrir le prochain lieu de la mission.',
                objectifs: [
                    'Identifier le lieu de la mission',
                    'Trouver l\'indice caché',
                    'Résoudre l\'énigme'
                ],
                indices: 'L\'indice est caché dans le café, derrière le bar.'
            }
        }
    },
    methods: {
        startMission() {
            alert('Mission commencée ! Bonne chance.')
        }
    }
}
</script>

<style scoped>
.missions-view {
    padding: 1rem;
}

.mission-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    background-color: #f8f9fa;
}

.mission-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.mission-header h3 {
    margin: 0;
    color: #333;
}

.difficulty {
    background-color: #ffc107;
    color: #212529;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.9rem;
    font-weight: bold;
}

.mission-description p {
    margin: 0.5rem 0;
}

.mission-objectives h4,
.mission-hints h4 {
    margin: 1rem 0 0.5rem 0;
    color: #333;
}

.mission-objectives ul {
    margin: 0.5rem 0;
    padding-left: 1rem;
}

.mission-actions {
    margin-top: 1rem;
    text-align: center;
}

.start-btn {
    padding: 0.75rem 1.5rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
}

.start-btn:hover {
    background-color: #0056b3;
}

.no-missions {
    text-align: center;
    padding: 2rem;
    color: #6c757d;
}
</style>
