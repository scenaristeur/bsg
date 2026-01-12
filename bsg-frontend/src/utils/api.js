// Fichier de configuration de l'API
const API_BASE_URL = 'http://localhost:3000'

export const api = {
    // Méthode générique pour les requêtes HTTP
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        }

        try {
            const response = await fetch(url, config)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            return await response.json()
        } catch (error) {
            console.error('API Error:', error)
            throw error
        }
    },

    // Méthodes spécifiques pour chaque endpoint
    async getUsers() {
        return this.request('/api/users')
    },

    async createUser(userData) {
        return this.request('/api/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        })
    },

    async loginUser(credentials) {
        return this.request('/api/users/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        })
    },

    async getMissions() {
        return this.request('/api/missions')
    },

    async createMission(missionData) {
        return this.request('/api/missions', {
            method: 'POST',
            body: JSON.stringify(missionData)
        })
    },

    async getInteractions() {
        return this.request('/api/interactions')
    },

    async getEncounters() {
        return this.request('/api/rencontres')
    }
}
