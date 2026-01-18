// Gestionnaire d'authentification pour l'application BSG
// Ce module gère toutes les opérations d'authentification avec Supabase

import { supabase } from '../utils/supabase'

class AuthManager {
    constructor() {
        this.currentUser = null
        this.isAuthenticated = false
    }

    /**
     * Inscription d'un nouvel utilisateur
     * @param {Object} userData - Données de l'utilisateur
     * @returns {Object} Résultat de l'inscription
     */
    async signUp(userData) {
        try {
            // Vérification des données d'entrée
            if (!userData.email || !userData.password) {
                throw new Error('Email et mot de passe requis')
            }

            // Inscription avec Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email: userData.email,
                password: userData.password,
                options: {
                    data: {
                        pseudo: userData.pseudo || '',
                        nom: userData.nom || '',
                        prenom: userData.prenom || ''
                    }
                }
            })

            if (error) {
                throw error
            }

            // Si l'inscription est réussie, on récupère l'utilisateur
            if (data.user) {
                this.currentUser = data.user
                this.isAuthenticated = true

                // Création de l'enregistrement dans la table users
                const { error: userError } = await supabase
                    .from('users')
                    .insert([{
                        id: data.user.id,
                        pseudo: userData.pseudo || '',
                        nom: userData.nom || '',
                        prenom: userData.prenom || '',
                        competences: [],
                        historique: []
                    }])

                if (userError) {
                    console.warn('Erreur lors de la création de l\'enregistrement utilisateur:', userError)
                }

                return {
                    success: true,
                    user: data.user
                }
            }

            return {
                success: false,
                error: 'Impossible de créer l\'utilisateur'
            }
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error)
            return {
                success: false,
                error: error.message
            }
        }
    }

    /**
     * Connexion d'un utilisateur existant
     * @param {string} email - Email de l'utilisateur
     * @param {string} password - Mot de passe
     * @returns {Object} Résultat de la connexion
     */
    async signIn(email, password) {
        try {
            if (!email || !password) {
                throw new Error('Email et mot de passe requis')
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) {
                throw error
            }

            if (data.user) {
                this.currentUser = data.user
                this.isAuthenticated = true

                // Récupération des données complètes de l'utilisateur
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', data.user.id)
                    .single()

                if (!userError && userData) {
                    this.currentUser = { ...data.user, ...userData }
                }

                return {
                    success: true,
                    user: data.user
                }
            }

            return {
                success: false,
                error: 'Connexion échouée'
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error)
            return {
                success: false,
                error: error.message
            }
        }
    }

    /**
     * Déconnexion de l'utilisateur
     * @returns {Object} Résultat de la déconnexion
     */
    async signOut() {
        try {
            const { error } = await supabase.auth.signOut()

            if (error) {
                throw error
            }

            this.currentUser = null
            this.isAuthenticated = false

            return {
                success: true
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error)
            return {
                success: false,
                error: error.message
            }
        }
    }

    /**
     * Récupération de l'utilisateur courant
     * @returns {Object|null} Informations de l'utilisateur
     */
    getCurrentUser() {
        return this.currentUser
    }

    /**
     * Vérification de l'état d'authentification
     * @returns {boolean} True si l'utilisateur est authentifié
     */
    isAuthenticated() {
        return this.isAuthenticated
    }

    /**
     * Récupération du token d'authentification
     * @returns {string|null} Token JWT
     */
    async getAuthToken() {
        try {
            const { data } = await supabase.auth.getSession()
            return data.session?.access_token || null
        } catch (error) {
            console.error('Erreur lors de la récupération du token:', error)
            return null
        }
    }

    /**
     * Réinitialisation du mot de passe
     * @param {string} email - Email de l'utilisateur
     * @returns {Object} Résultat de la réinitialisation
     */
    async resetPassword(email) {
        try {
            if (!email) {
                throw new Error('Email requis')
            }

            const { error } = await supabase.auth.resetPasswordForEmail(email)

            if (error) {
                throw error
            }

            return {
                success: true
            }
        } catch (error) {
            console.error('Erreur lors de la réinitialisation du mot de passe:', error)
            return {
                success: false,
                error: error.message
            }
        }
    }

    /**
     * Vérification de l'état de l'authentification en temps réel
     */
    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                this.currentUser = session.user
                this.isAuthenticated = true
            } else if (event === 'SIGNED_OUT') {
                this.currentUser = null
                this.isAuthenticated = false
            }
            callback(event, session)
        })
    }

    /**
     * Mise à jour des informations de l'utilisateur
     * @param {Object} updates - Données à mettre à jour
     * @returns {Object} Résultat de la mise à jour
     */
    async updateUser(updates) {
        try {
            // Mise à jour dans Supabase Auth
            const { data, error } = await supabase.auth.updateUser(updates)

            if (error) {
                throw error
            }

            // Mise à jour dans la table users
            if (this.currentUser?.id) {
                const { error: userError } = await supabase
                    .from('users')
                    .update(updates)
                    .eq('id', this.currentUser.id)

                if (userError) {
                    console.warn('Erreur lors de la mise à jour de la table users:', userError)
                }
            }

            this.currentUser = { ...this.currentUser, ...data.user }

            return {
                success: true,
                user: data.user
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur:', error)
            return {
                success: false,
                error: error.message
            }
        }
    }
}

// Exportation singleton
export const authManager = new AuthManager()
