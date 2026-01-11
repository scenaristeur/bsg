import axios from 'axios'

// Configuration de l'URL de base pour l'API backend
const API_BASE_URL = 'http://localhost:3000'

// Création d'une instance axios avec la configuration de base
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

/**
 * Service pour gérer les utilisateurs
 */
export const userService = {
    /**
     * Récupère tous les utilisateurs
     * @returns {Promise<Array>} Liste des utilisateurs
     */
    async getUsers() {
        try {
            const response = await apiClient.get('/users')
            return response.data
        } catch (error) {
            throw new Error('Erreur lors de la récupération des utilisateurs')
        }
    },

    /**
     * Crée un nouvel utilisateur
     * @param {Object} userData - Données de l'utilisateur à créer
     * @returns {Promise<Object>} Utilisateur créé
     */
    async createUser(userData) {
        try {
            const response = await apiClient.post('/users', userData)
            return response.data
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.error || 'Erreur lors de la création de l\'utilisateur')
            } else {
                throw new Error('Erreur de connexion au serveur')
            }
        }
    },

    /**
     * Met à jour un utilisateur
     * @param {number} userId - ID de l'utilisateur à mettre à jour
     * @param {Object} userData - Données de l'utilisateur à mettre à jour
     * @returns {Promise<Object>} Utilisateur mis à jour
     */
    async updateUser(userId, userData) {
        try {
            const response = await apiClient.put(`/users/${userId}`, userData)
            return response.data
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.error || 'Erreur lors de la mise à jour de l\'utilisateur')
            } else {
                throw new Error('Erreur de connexion au serveur')
            }
        }
    },

    /**
     * Supprime un utilisateur
     * @param {number} userId - ID de l'utilisateur à supprimer
     * @returns {Promise<Object>} Résultat de la suppression
     */
    async deleteUser(userId) {
        try {
            const response = await apiClient.delete('/users', { data: { id: userId } })
            return response.data
        } catch (error) {
            throw new Error('Erreur lors de la suppression de l\'utilisateur')
        }
    },

    /**
     * Connecte un utilisateur
     * @param {Object} credentials - Identifiants de connexion
     * @returns {Promise<Object>} Utilisateur connecté
     */
    async loginUser(credentials) {
        try {
            const response = await apiClient.post('/login', credentials)
            return response.data
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.error || 'Erreur lors de la connexion')
            } else {
                throw new Error('Erreur de connexion au serveur')
            }
        }
    }
}
