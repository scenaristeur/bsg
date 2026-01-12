// Service pour gérer les opérations liées aux missions
const API_BASE_URL = 'http://localhost:3000'

export const missionService = {
    // Récupérer les missions d'un utilisateur
    async getUserMissions(userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/missions/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error('Erreur lors de la récupération des missions:', error)
            throw error
        }
    },

    // Récupérer toutes les missions (pour référence)
    async getAllMissions() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/missions`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error('Erreur lors de la récupération des missions:', error)
            throw error
        }
    },

    // Créer une nouvelle mission
    async createMission(missionData) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/missions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(missionData)
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error('Erreur lors de la création de la mission:', error)
            throw error
        }
    },

    // Générer une mission via N8N
    async generateMission(userId, location, preferences) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/missions/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    location,
                    preferences
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error('Erreur lors de la génération de la mission:', error)
            throw error
        }
    }
}
