<template>
    <div class="webhook-test">
        <h2>Test du Webhook n8n</h2>

        <div class="webhook-info">
            <h3>URL du webhook :</h3>
            <input v-model="webhookUrl" type="text" class="url-input" />
        </div>

        <div class="test-controls">
            <button @click="testPost" :disabled="loading" class="test-btn">
                {{ loading ? 'En cours...' : 'Tester le POST' }}
            </button>
            <button @click="clearResult" class="clear-btn">Effacer les résultats</button>
        </div>

        <div class="request-data">
            <h3>Données à envoyer :</h3>
            <textarea v-model="requestData" placeholder="Données JSON à envoyer" rows="8" cols="50"></textarea>
        </div>

        <div v-if="error" class="error">
            <h4>Erreur :</h4>
            <p>{{ error }}</p>
        </div>

        <div v-if="result" class="result">
            <h4>Résultat :</h4>
            <pre>{{ JSON.stringify(result, null, 2) }}</pre>
        </div>

        <div v-if="webhookResults.length > 0" class="webhook-results">
            <h4>Résultats du webhook :</h4>
            <div v-for="(item, index) in webhookResults" :key="index" class="result-item">
                <pre>{{ JSON.stringify(item, null, 2) }}</pre>
            </div>
        </div>

        <div v-if="lastRequestTime" class="last-request">
            <p>Dernière requête : {{ lastRequestTime }}</p>
        </div>
    </div>
</template>

<script>
import { useUserStore } from '../stores/user'

export default {
    name: 'WebhookTest',
    data() {
        return {
            loading: false,
            error: null,
            result: null,
            lastRequestTime: null,
            webhookUrl: 'http://localhost:5678/webhook/cdac2c18-00f0-4020-b316-a695181d9b3f',
            requestData: '',
            webhookResults: []
        }
    },
    computed: {
        currentUser() {
            const userStore = useUserStore()
            return userStore.currentUser
        }
    },
    mounted() {
        // Initialiser les données avec les informations de l'utilisateur courant
        this.initializeRequestData()

        // Configurer l'écoute des messages WebSocket pour recevoir les résultats du webhook
        this.setupWebhookListener()
    },
    beforeUnmount() {
        // Nettoyage lors de la destruction du composant
        if (this.websocket) {
            this.websocket.close()
        }
    },
    methods: {
        setupWebhookListener() {
            // Pour l'instant, on laisse ce code comme exemple
            // Dans une implémentation réelle, vous utiliseriez WebSocket ou un autre mécanisme
            console.log('Écoute des résultats du webhook...')
        },
        initializeRequestData() {
            const userData = this.currentUser || {
                id: "test-user-123",
                pseudo: "UtilisateurTest",
                prenom: "Test",
                nom: "Utilisateur",
                email: "test@example.com"
            }

            const chatInput = "Génère une notification personnalisée pour un utilisateur de l'application BSG. L'utilisateur est une professeure célibataire qui vient de sortir du lycée. Elle doit prendre le bus 34 pour rejoindre son domicile à Perrache. Elle devra se diriger vers le fond du bus et chercher un partenaire avec une écharpe bleue. Le partenaire lui fournira des informations cruciales pour une mission."

            this.requestData = JSON.stringify({
                user: userData,
                chatInput: chatInput
            }, null, 2)
        },
        async testPost() {
            this.loading = true
            this.error = null
            this.result = null

            try {
                // Parse les données JSON entrantes
                const jsonData = JSON.parse(this.requestData)

                // Appel au endpoint du webhook avec méthode POST
                const response = await fetch(this.webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(jsonData)
                })

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`)
                }

                const data = await response.json()
                this.result = data
                this.lastRequestTime = new Date().toLocaleString('fr-FR')

            } catch (error) {
                this.error = error.message || 'Une erreur inconnue est survenue'
                console.error('Erreur lors du test du webhook:', error)
            } finally {
                this.loading = false
            }
        },
        clearResult() {
            this.error = null
            this.result = null
            this.lastRequestTime = null
            this.webhookResults = []
        }
    }
}
</script>

<style scoped>
.webhook-test {
    padding: 1rem;
    max-width: 800px;
    margin: 0 auto;
}

.webhook-info {
    background-color: #e9ecef;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
}

.url-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.9rem;
}

.request-data {
    margin: 1rem 0;
}

.request-data textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.9rem;
}

.test-controls {
    margin: 1rem 0;
    display: flex;
    gap: 1rem;
    align-items: center;
}

.test-btn,
.clear-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.test-btn {
    background-color: #007bff;
    color: white;
}

.test-btn:hover:not(:disabled) {
    background-color: #0056b3;
}

.test-btn:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}

.clear-btn {
    background-color: #6c757d;
    color: white;
}

.clear-btn:hover {
    background-color: #5a6268;
}

.error {
    background-color: #f8d7da;
    color: #721c24;
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem 0;
}

.error h4 {
    margin-top: 0;
}

.result {
    background-color: #d4edda;
    color: #155724;
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem 0;
    overflow-x: auto;
}

.result h4 {
    margin-top: 0;
}

.result pre {
    background-color: #f8f9fa;
    padding: 0.5rem;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 0.9rem;
}

.last-request {
    text-align: center;
    color: #6c757d;
    font-style: italic;
    margin-top: 1rem;
}
</style>
