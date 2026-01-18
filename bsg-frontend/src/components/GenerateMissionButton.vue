<template>
    <div class="generate-mission-container">
        <button @click="generateMission" :disabled="loading" class="generate-mission-btn"
            :class="{ 'loading': loading }">
            <span v-if="loading">Génération en cours...</span>
            <span v-else>Générer une nouvelle mission</span>
        </button>

        <div v-if="error" class="error-message">
            {{ error }}
        </div>

        <div v-if="success" class="success-message">
            Mission en cours de génération via n8n !
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { authManager } from '../modules/AuthManager'

export default {
    name: 'GenerateMissionButton',
    data() {
        return {
            loading: false,
            error: null,
            success: false
        }
    },
    computed: {
        ...mapState('auth', ['user']),
        ...mapGetters('auth', ['currentUser'])
    },
    methods: {
        async generateMission() {
            this.loading = true
            this.error = null
            this.success = false

            try {
                // Récupérer les informations de l'utilisateur
                const user = this.currentUser || this.user

                if (!user) {
                    throw new Error('Utilisateur non connecté')
                }

                // Récupérer l'URL du webhook n8n depuis les variables d'environnement
                const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL
                if (!n8nWebhookUrl) {
                    throw new Error('Variable d\'environnement VITE_N8N_WEBHOOK_URL non définie')
                }

                // Données à envoyer à n8n
                const n8nPayload = {
                    user: {
                        id: user.id,
                        pseudo: user.pseudo || user.user_metadata?.pseudo || '',
                        prenom: user.prenom || user.user_metadata?.prenom || '',
                        nom: user.nom || user.user_metadata?.nom || '',
                        email: user.email,
                        preferencesRencontre: user.preferencesRencontre || {}
                    },
                    chatInput: `Génère une mission personnalisée pour l'utilisateur ${user.prenom || user.user_metadata?.prenom || 'Utilisateur'} ${user.nom || user.user_metadata?.nom || 'Inconnu'}. 
                    Crée une mission captivante dans le style de l'application BSG avec un titre, une description, un niveau de difficulté, des objectifs et des indices.`
                }

                console.log('Envoi de la requête à n8n:', n8nPayload);

                // Effectuer l'appel HTTP vers le webhook n8n
                const response = await fetch(n8nWebhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(n8nPayload)
                })

                console.log('Réponse n8n:', response.status, response.statusText);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Erreur n8n:', errorText);
                    throw new Error(`Erreur HTTP de n8n: ${response.status} - ${response.statusText} - ${errorText}`)
                }

                const n8nData = await response.json()
                console.log('Données reçues de n8n:', n8nData);

                this.success = true
                console.log('Mission envoyée avec succès à n8n')

                // Afficher une notification à l'utilisateur
                notificationHandler.showNotification('Mission en cours de génération via n8n !');

                // Rediriger vers la page des missions pour voir la génération
                this.$router.push('/missions')

            } catch (error) {
                console.error('Erreur lors de la génération de la mission:', error)
                this.error = error.message || 'Erreur lors de la génération de la mission'
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style scoped>
.generate-mission-container {
    text-align: center;
    padding: 2rem;
}

.generate-mission-btn {
    padding: 1rem 2rem;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.generate-mission-btn:hover:not(:disabled) {
    background-color: #218838;
}

.generate-mission-btn:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}

.generate-mission-btn.loading {
    opacity: 0.7;
}

.error-message {
    margin-top: 1rem;
    padding: 0.75rem;
    background-color: #f8d7da;
    color: #721c24;
    border-radius: 4px;
    text-align: center;
}

.success-message {
    margin-top: 1rem;
    padding: 0.75rem;
    background-color: #d4edda;
    color: #155724;
    border-radius: 4px;
    text-align: center;
}
</style>
