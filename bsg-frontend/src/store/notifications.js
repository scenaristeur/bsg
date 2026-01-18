// Gestion des notifications en attente
// Module Vuex pour la gestion d'état des notifications

export const notificationsModule = {
    namespaced: true,

    state: {
        pendingNotifications: [],
        unreadCount: 0,
        loading: false,
        error: null
    },

    getters: {
        // Obtenir les notifications en attente
        pendingNotifications: (state) => state.pendingNotifications,

        // Obtenir le nombre de notifications non lues
        unreadCount: (state) => state.unreadCount,

        // Obtenir toutes les notifications
        allNotifications: (state) => state.pendingNotifications,

        // Vérifier si une notification est en attente
        hasPendingNotifications: (state) => state.pendingNotifications.length > 0
    },

    mutations: {
        // Ajouter une notification
        ADD_NOTIFICATION(state, notification) {
            state.pendingNotifications.unshift(notification);
            state.unreadCount = state.pendingNotifications.length;
        },

        // Marquer une notification comme lue
        MARK_NOTIFICATION_AS_READ(state, notificationId) {
            const index = state.pendingNotifications.findIndex(n => n.id === notificationId);
            if (index !== -1) {
                state.pendingNotifications[index].read = true;
                state.unreadCount = state.pendingNotifications.filter(n => !n.read).length;
            }
        },

        // Marquer toutes les notifications comme lues
        MARK_ALL_AS_READ(state) {
            state.pendingNotifications.forEach(n => n.read = true);
            state.unreadCount = 0;
        },

        // Supprimer une notification
        REMOVE_NOTIFICATION(state, notificationId) {
            state.pendingNotifications = state.pendingNotifications.filter(n => n.id !== notificationId);
            state.unreadCount = state.pendingNotifications.length;
        },

        // Définir les notifications
        SET_NOTIFICATIONS(state, notifications) {
            state.pendingNotifications = notifications;
            state.unreadCount = notifications.filter(n => !n.read).length;
        },

        // Définir l'état de chargement
        SET_LOADING(state, loading) {
            state.loading = loading;
        },

        // Définir une erreur
        SET_ERROR(state, error) {
            state.error = error;
        },

        // Réinitialiser l'état des notifications
        RESET_NOTIFICATIONS_STATE(state) {
            state.pendingNotifications = [];
            state.unreadCount = 0;
            state.error = null;
        }
    },

    actions: {
        // Charger les notifications d'un utilisateur
        async loadUserNotifications({ commit }, userId) {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);

            try {
                // Ici, on chargerait les notifications depuis Supabase
                // const supabaseManager = new SupabaseManager();
                // const result = await supabaseManager.loadNotifications(userId);

                // Pour l'exemple, on simule le chargement de notifications
                const mockNotifications = [
                    {
                        id: 1,
                        type: 'mission_created',
                        title: 'Nouvelle Mission',
                        message: 'Une nouvelle mission a été créée pour vous',
                        read: false,
                        timestamp: new Date().toISOString()
                    },
                    {
                        id: 2,
                        type: 'meeting_scheduled',
                        title: 'Rencontre Programmée',
                        message: 'Vous avez une rencontre programmée',
                        read: false,
                        timestamp: new Date().toISOString()
                    }
                ];

                commit('SET_NOTIFICATIONS', mockNotifications);
                commit('SET_LOADING', false);

                return { success: true, notifications: mockNotifications };
            } catch (error) {
                commit('SET_ERROR', error.message);
                commit('SET_LOADING', false);
                return { success: false, error: error.message };
            }
        },

        // Ajouter une notification
        async addNotification({ commit }, notificationData) {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);

            try {
                // Ici, on enregistrerait la notification dans Supabase
                // const supabaseManager = new SupabaseManager();
                // const result = await supabaseManager.createNotification(notificationData);

                // Pour l'exemple, on simule l'ajout
                const newNotification = {
                    id: Date.now(),
                    ...notificationData,
                    read: false,
                    timestamp: new Date().toISOString()
                };

                commit('ADD_NOTIFICATION', newNotification);
                commit('SET_LOADING', false);

                return { success: true, notification: newNotification };
            } catch (error) {
                commit('SET_ERROR', error.message);
                commit('SET_LOADING', false);
                return { success: false, error: error.message };
            }
        },

        // Marquer une notification comme lue
        async markAsRead({ commit }, notificationId) {
            try {
                // Ici, on marquerait la notification comme lue dans Supabase
                // const supabaseManager = new SupabaseManager();
                // const result = await supabaseManager.markNotificationAsRead(notificationId);

                // Pour l'exemple, on simule cette action
                commit('MARK_NOTIFICATION_AS_READ', notificationId);
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // Marquer toutes les notifications comme lues
        async markAllAsRead({ commit }) {
            try {
                // Ici, on marquerait toutes les notifications comme lues dans Supabase
                // const supabaseManager = new SupabaseManager();
                // const result = await supabaseManager.markAllNotificationsAsRead(userId);

                // Pour l'exemple, on simule cette action
                commit('MARK_ALL_AS_READ');
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // Supprimer une notification
        async deleteNotification({ commit }, notificationId) {
            try {
                // Ici, on supprimerait la notification de Supabase
                // const supabaseManager = new SupabaseManager();
                // const result = await supabaseManager.deleteNotification(notificationId);

                // Pour l'exemple, on simule cette action
                commit('REMOVE_NOTIFICATION', notificationId);
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    }
};
