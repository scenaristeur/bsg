// Gestionnaire d'authentification pour l'application BSG
// Ce module gère toutes les opérations d'authentification avec Supabase

import { supabase } from '../utils/supabase'

class AuthManager {
    constructor() {
        this.currentUser = null
        this.isAuthenticated = false
    }

    /**
     * Définir l'utilisateur courant
     * @param {Object} user - Informations de l'utilisateur
     */
    setCurrentUser(user) {
        this.currentUser = user;
        this.isAuthenticated = !!user;
        console.log('Utilisateur courant défini:', user);
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

                // L'enregistrement dans la table users est géré automatiquement par Supabase
                // via les triggers ou les hooks d'authentification
                // On ne fait pas d'insertion manuelle ici

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

                console.log('UUID de l\'utilisateur connecté:', data.user.id);

                // Vérification si l'utilisateur existe déjà dans la table users
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', data.user.id)
                    .single()

                if (userError) {
                    // Si l'utilisateur n'existe pas encore dans la table users, on le crée
                    console.log('Création de l\'utilisateur dans la table users...');
                    const { error: insertError } = await supabase
                        .from('users')
                        .insert([{
                            id: data.user.id,
                            pseudo: data.user.user_metadata?.pseudo || '',
                            nom: data.user.user_metadata?.nom || '',
                            prenom: data.user.user_metadata?.prenom || '',
                            competences: [],
                            historique: []
                        }])

                    if (insertError) {
                        console.error('Erreur lors de la création de l\'utilisateur dans users:', insertError);
                    } else {
                        console.log('Utilisateur créé avec succès dans la table users');
                        // On récupère les données nouvellement créées
                        const { data: newUserdata, error: newUserError } = await supabase
                            .from('users')
                            .select('*')
                            .eq('id', data.user.id)
                            .single()

                        if (!newUserError && newUserdata) {
                            this.currentUser = { ...data.user, ...newUserdata }
                            console.log('Informations de l\'utilisateur dans la table users:', newUserdata);
                            // Retourner les données complètes dans le résultat
                            return {
                                success: true,
                                user: { ...data.user, ...newUserdata }
                            }
                        }
                    }
                } else if (userData) {
                    // Si l'utilisateur existe déjà, on le charge
                    this.currentUser = { ...data.user, ...userData }
                    console.log('Informations de l\'utilisateur dans la table users:', userData);
                    // Retourner les données complètes dans le résultat
                    return {
                        success: true,
                        user: { ...data.user, ...userData }
                    }
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
            console.log('Mise à jour utilisateur - Données reçues:', updates);
            console.log('Utilisateur courant avant mise à jour:', this.currentUser);

            // Si l'utilisateur courant n'est pas défini, on tente de le récupérer depuis le store
            // (cas où l'AuthManager n'a pas été synchronisé)
            if (!this.currentUser?.id) {
                console.log('Recherche de l\'utilisateur dans le store...');
                // On tente de récupérer l'utilisateur depuis le store via une méthode
                // Pour cela, on va utiliser une approche plus directe
                // On suppose que l'utilisateur est accessible via le store Vuex
            }

            // Mise à jour dans la table users uniquement
            // (les champs comme email, password sont gérés par Supabase Auth)
            if (this.currentUser?.id) {
                // Séparation des champs pour Supabase Auth et pour la table users
                const authFields = {};
                const userFields = {};

                // Séparer les champs qui doivent aller dans Supabase Auth vs la table users
                Object.keys(updates).forEach(key => {
                    if (['email', 'password'].includes(key)) {
                        authFields[key] = updates[key];
                    } else {
                        userFields[key] = updates[key];
                    }
                });

                console.log('Champs auth:', authFields);
                console.log('Champs user:', userFields);

                // Mise à jour des champs d'authentification si présents
                if (Object.keys(authFields).length > 0) {
                    console.log('Mise à jour des champs d\'authentification...');
                    const { data, error } = await supabase.auth.updateUser(authFields);
                    if (error) {
                        console.error('Erreur lors de la mise à jour auth:', error);
                        throw error;
                    }
                    console.log('Mise à jour auth réussie:', data);
                }

                // Mise à jour dans la table users
                console.log('Mise à jour de la table users avec:', userFields);
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .update(userFields)
                    .eq('id', this.currentUser.id)
                    .select()
                    .single();

                if (userError) {
                    console.error('Erreur lors de la mise à jour de la table users:', userError);
                    throw userError;
                }
                console.log('Mise à jour table users réussie:', userData);

                // Mettre à jour l'utilisateur courant avec les données mises à jour
                if (userData) {
                    this.currentUser = { ...this.currentUser, ...userData };
                    console.log('Utilisateur mis à jour:', this.currentUser);
                }
            } else {
                console.warn('Aucun utilisateur courant trouvé pour la mise à jour');
            }

            return {
                success: true,
                user: this.currentUser
            }
        } catch (error) {
            console.error('Erreur complète lors de la mise à jour de l\'utilisateur:', error);
            return {
                success: false,
                error: error.message
            }
        }
    }
}

// Exportation singleton
export const authManager = new AuthManager()
