// Gestion de la session et des permissions utilisateur
// Module Vuex pour la gestion d'état de l'authentification

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
                // Ici, on utiliserait l'AuthManager pour effectuer la connexion
                // const authManager = new AuthManager(supabaseManager);
                // const result = await authManager.signIn(email, password);

                // Pour l'exemple, on simule une connexion réussie
                const mockUser = {
                    id: 1,
                    email: email,
                    pseudo: 'UtilisateurTest',
                    nom: 'Test',
                    prenom: 'Utilisateur'
                };

                commit('SET_USER', mockUser);
                commit('SET_PERMISSIONS', ['read', 'write']);
                commit('SET_LOADING', false);

                return { success: true, user: mockUser };
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
                // Ici, on utiliserait l'AuthManager pour l'inscription
                // const authManager = new AuthManager(supabaseManager);
                // const result = await authManager.signUp(email, password, userData);

                // Pour l'exemple, on simule une inscription réussie
                const mockUser = {
                    id: 2,
                    email: email,
                    pseudo: userData.pseudo,
                    nom: userData.nom,
                    prenom: userData.prenom
                };

                commit('SET_USER', mockUser);
                commit('SET_PERMISSIONS', ['read']);
                commit('SET_LOADING', false);

                return { success: true, user: mockUser };
            } catch (error) {
                commit('SET_ERROR', error.message);
                commit('SET_LOADING', false);
                return { success: false, error: error.message };
            }
        },

        // Déconnexion
        async logout({ commit }) {
            try {
                // Ici, on utiliserait l'AuthManager pour la déconnexion
                // const authManager = new AuthManager(supabaseManager);
                // await authManager.signOut();

                // Pour l'exemple, on simule une déconnexion réussie
                commit('RESET_AUTH_STATE');
                return { success: true };
            } catch (error) {
                commit('SET_ERROR', error.message);
                return { success: false, error: error.message };
            }
        },

        // Vérifier l'état de l'authentification
        async checkAuthStatus({ commit }) {
            commit('SET_LOADING', true);

            try {
                // Ici, on vérifierait l'état de l'authentification avec Supabase
                // const authManager = new AuthManager(supabaseManager);
                // const user = authManager.getCurrentUser();

                // Pour l'exemple, on suppose qu'un utilisateur est connecté
                const mockUser = {
                    id: 1,
                    email: 'user@example.com',
                    pseudo: 'UtilisateurTest',
                    nom: 'Test',
                    prenom: 'Utilisateur'
                };

                commit('SET_USER', mockUser);
                commit('SET_PERMISSIONS', ['read', 'write']);
                commit('SET_LOADING', false);

                return { success: true, user: mockUser };
            } catch (error) {
                commit('SET_LOADING', false);
                commit('SET_ERROR', error.message);
                return { success: false, error: error.message };
            }
        }
    }
};
