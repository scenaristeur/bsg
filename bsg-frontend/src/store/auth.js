// Gestion de la session et des permissions utilisateur
// Module Vuex pour la gestion d'état de l'authentification

import { authManager } from '../modules/AuthManager'

export const authModule = {
    namespaced: true,

    state: {
        user: null,
        isAuthenticated: false,
        permissions: [],
        loading: false,
        error: null
    },

    getters: {
        // Vérifier si l'utilisateur est connecté
        isLoggedIn: (state) => state.isAuthenticated,

        // Obtenir les permissions de l'utilisateur
        userPermissions: (state) => state.permissions,

        // Obtenir les informations de l'utilisateur
        currentUser: (state) => state.user,

        // Vérifier si l'utilisateur a une permission spécifique
        hasPermission: (state) => (permission) => {
            return state.permissions.includes(permission);
        }
    },

    mutations: {
        // Définir l'utilisateur connecté
        SET_USER(state, user) {
            state.user = user;
            state.isAuthenticated = !!user;
        },

        // Définir les permissions de l'utilisateur
        SET_PERMISSIONS(state, permissions) {
            state.permissions = permissions;
        },

        // Définir l'état de chargement
        SET_LOADING(state, loading) {
            state.loading = loading;
        },

        // Définir une erreur d'authentification
        SET_ERROR(state, error) {
            state.error = error;
        },

        // Réinitialiser l'état d'authentification
        RESET_AUTH_STATE(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.permissions = [];
            state.error = null;
        }
    },

    actions: {
        // Connexion d'un utilisateur
        async login({ commit }, { email, password }) {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);

            try {
                const result = await authManager.signIn(email, password);
                if (result.success) {
                    // Assurer que les données complètes (y compris celles de la table users) sont utilisées
                    commit('SET_USER', result.user);
                    commit('SET_PERMISSIONS', ['read', 'write']); // Permissions de base
                    commit('SET_LOADING', false);
                    return { success: true, user: result.user };
                } else {
                    commit('SET_ERROR', result.error);
                    commit('SET_LOADING', false);
                    return { success: false, error: result.error };
                }
            } catch (error) {
                commit('SET_ERROR', error.message);
                commit('SET_LOADING', false);
                return { success: false, error: error.message };
            }
        },

        // Inscription d'un nouvel utilisateur
        async signup({ commit }, { email, password, userData }) {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);

            try {
                const result = await authManager.signUp({
                    email,
                    password,
                    pseudo: userData.pseudo,
                    nom: userData.nom,
                    prenom: userData.prenom
                });

                if (result.success) {
                    commit('SET_USER', result.user);
                    commit('SET_PERMISSIONS', ['read']); // Permissions de base pour nouvel utilisateur
                    commit('SET_LOADING', false);
                    return { success: true, user: result.user };
                } else {
                    commit('SET_ERROR', result.error);
                    commit('SET_LOADING', false);
                    return { success: false, error: result.error };
                }
            } catch (error) {
                commit('SET_ERROR', error.message);
                commit('SET_LOADING', false);
                return { success: false, error: error.message };
            }
        },

        // Déconnexion
        async logout({ commit }) {
            try {
                const result = await authManager.signOut();
                if (result.success) {
                    commit('RESET_AUTH_STATE');
                    return { success: true };
                } else {
                    commit('SET_ERROR', result.error);
                    return { success: false, error: result.error };
                }
            } catch (error) {
                commit('SET_ERROR', error.message);
                return { success: false, error: error.message };
            }
        },

        // Vérifier l'état de l'authentification
        async checkAuthStatus({ commit }) {
            commit('SET_LOADING', true);

            try {
                // On pourrait vérifier l'état avec Supabase ici
                // Pour l'instant, on laisse tel quel
                commit('SET_LOADING', false);
                return { success: true };
            } catch (error) {
                commit('SET_LOADING', false);
                commit('SET_ERROR', error.message);
                return { success: false, error: error.message };
            }
        }
    }
};
