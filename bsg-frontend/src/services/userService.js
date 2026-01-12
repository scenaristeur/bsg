// Service pour gérer les opérations liées aux utilisateurs
import { api } from '../utils/api'

export const userService = {
    // Connexion d'un utilisateur
    async loginUser(credentials) {
        const response = await api.loginUser(credentials)
        return response
    },

    // Inscription d'un nouvel utilisateur
    async createUser(userData) {
        const response = await api.createUser(userData)
        return response
    },

    // Récupération de tous les utilisateurs
    async getAllUsers() {
        const response = await api.getUsers()
        return response
    },

    // Récupération d'un utilisateur spécifique
    async getUserById(id) {
        const response = await api.getUser(id)
        return response
    },

    // Mise à jour d'un utilisateur
    async updateUser(id, userData) {
        const response = await api.updateUser(id, userData)
        return response
    },

    // Suppression d'un utilisateur
    async deleteUser(id) {
        const response = await api.deleteUser(id)
        return response
    }
}
