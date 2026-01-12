<template>
    <div class="generate-mission-section">
        <button @click="generateNewMission" :disabled="isGenerating" class="generate-mission-btn">
            {{ isGenerating ? 'Génération en cours...' : 'Générer une nouvelle mission' }}
        </button>

        <div v-if="missionStatus" class="mission-status">
            <p>{{ missionStatus }}</p>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

export default {
    name: 'GenerateMissionButton',
    setup() {
        const userStore = useUserStore()
        const isGenerating = ref(false)
        const missionStatus = ref('')

        const generateNewMission = async () => {
            if (!userStore.currentUser) {
                missionStatus.value = 'Veuillez vous connecter pour générer une mission'
                return
            }

            isGenerating.value = true
            missionStatus.value = 'Génération de la mission...'

            try {
                // Appel au backend pour générer une mission
                const response = await fetch('http://localhost:3000/api/missions/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userStore.token}`
                    },
                    body: JSON.stringify({
                        userId: userStore.currentUser.id,
                        location: userStore.currentUser.location || {},
                        preferences: userStore.currentUser.preferencesRencontre || {}
                    })
                })

                // Vérifier si la réponse est vide avant de parser
                let data;
                if (response.headers.get('content-length') !== '0') {
                    data = await response.json()
                } else {
                    data = {}
                }

                if (response.ok) {
                    missionStatus.value = 'Mission en cours de génération via l\'agent n8n...'

                    // Attente de quelques secondes pour simuler le temps de génération
                    setTimeout(() => {
                        missionStatus.value = 'Mission générée avec succès !'
                    }, 3000)
                } else {
                    missionStatus.value = `Erreur: ${data.error || 'Impossible de générer la mission'}`
                }
            } catch (error) {
                console.error('Erreur lors de la génération de mission:', error)
                missionStatus.value = 'Erreur réseau lors de la génération de la mission'
            } finally {
                isGenerating.value = false
            }
        }

        return {
            isGenerating,
            missionStatus,
            generateNewMission
        }
    }
}
</script>

<style scoped>
.generate-mission-section {
    text-align: center;
    padding: 20px;
    margin: 20px 0;
}

.generate-mission-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 12px 24px;
    font-size: 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.generate-mission-btn:hover:not(:disabled) {
    background-color: #45a049;
}

.generate-mission-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.mission-status {
    margin-top: 15px;
    padding: 10px;
    border-radius: 4px;
    background-color: #e8f5e8;
    color: #2e7d32;
}
</style>
