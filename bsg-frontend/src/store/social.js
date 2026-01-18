// Gestion des interactions sociales entre joueurs
// Module Vuex pour la gestion d'état des interactions sociales

export const socialModule = {
    namespaced: true,

    state: {
        friends: [],
        interactions: [],
        messages: [],
        unreadMessages: 0,
        loading: false,
        error: null
    },

    getters: {
        // Obtenir la liste des amis
        friends: (state) => state.friends,

        // Obtenir le nombre d'amis
        friendsCount: (state) => state.friends.length,

        // Obtenir les interactions sociales
        interactions: (state) => state.interactions,

        // Obtenir les messages
        messages: (state) => state.messages,

        // Obtenir le nombre de messages non lus
        unreadMessages: (state) => state.unreadMessages,

        // Obtenir le nombre de notifications non lues
        unreadNotifications: (state) => state.unreadMessages,

        // Vérifier si l'utilisateur a des amis
        hasFriends: (state) => state.friends.length > 0,

        // Vérifier s'il y a des interactions
        hasInteractions: (state) => state.interactions.length > 0
    },

    mutations: {
        // Définir les amis
        SET_FRIENDS(state, friends) {
            state.friends = friends;
        },

        // Ajouter un ami
        ADD_FRIEND(state, friend) {
            state.friends.push(friend);
        },

        // Supprimer un ami
        REMOVE_FRIEND(state, friendId) {
            state.friends = state.friends.filter(f => f.id !== friendId);
        },

        // Définir les interactions
        SET_INTERACTIONS(state, interactions) {
            state.interactions = interactions;
        },

        // Ajouter une interaction
        ADD_INTERACTION(state, interaction) {
            state.interactions.unshift(interaction);
        },

        // Définir les messages
        SET_MESSAGES(state, messages) {
            state.messages = messages;
        },

        // Ajouter un message
        ADD_MESSAGE(state, message) {
            state.messages.push(message);
            if (!message.read) {
                state.unreadMessages++;
            }
        },

        // Marquer un message comme lu
        MARK_MESSAGE_AS_READ(state, messageId) {
            const message = state.messages.find(m => m.id === messageId);
            if (message && !message.read) {
                message.read = true;
                state.unreadMessages--;
            }
        },

        // Marquer tous les messages comme lus
        MARK_ALL_MESSAGES_AS_READ(state) {
            state.messages.forEach(m => m.read = true);
            state.unreadMessages = 0;
        },

        // Définir l'état de chargement
        SET_LOADING(state, loading) {
            state.loading = loading;
        },

        // Définir une erreur
        SET_ERROR(state, error) {
            state.error = error;
        },

        // Réinitialiser l'état social
        RESET_SOCIAL_STATE(state) {
            state.friends = [];
            state.interactions = [];
            state.messages = [];
            state.unreadMessages = 0;
            state.error = null;
        }
    },

    actions: {
        // Charger les amis d'un utilisateur
        async loadUserFriends({ commit }, userId) {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);

            try {
                // Ici, on chargerait les amis depuis Supabase
                // const supabaseManager = new SupabaseManager();
                // const result = await supabaseManager.loadFriends(userId);

                // Pour l'exemple, on simule le chargement d'amis
                const mockFriends = [
                    {
                        id: 1,
                        pseudo: 'Ami1',
                        nom: 'Dupont',
                        prenom: 'Jean',
                        avatar: '/avatars/ami1.jpg',
                        lastSeen: new Date().toISOString()
                    },
                    {
                        id: 2,
                        pseudo: 'Ami2',
                        nom: 'Martin',
                        prenom: 'Marie',
                        avatar: '/avatars/ami2.jpg',
                        lastSeen: new Date().toISOString()
                    }
                ];

                commit('SET_FRIENDS', mockFriends);
                commit('SET_LOADING', false);

                return { success: true, friends: mockFriends };
            } catch (error) {
                commit('SET_ERROR', error.message);
                commit('SET_LOADING', false);
                return { success: false, error: error.message };
            }
        },

        // Charger les interactions sociales
        async loadSocialInteractions({ commit }, userId) {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);

            try {
                // Ici, on chargerait les interactions depuis Supabase
                // const supabaseManager = new SupabaseManager();
                // const result = await supabaseManager.loadInteractions(userId);

                // Pour l'exemple, on simule le chargement d'interactions
                const mockInteractions = [
                    {
                        id: 1,
                        type: 'mission_completed',
                        user_id: 1,
                        target_user_id: 2,
                        mission_id: 1,
                        message: 'a terminé une mission',
                        timestamp: new Date().toISOString()
                    },
                    {
                        id: 2,
                        type: 'object_shared',
                        user_id: 2,
                        target_user_id: 1,
                        object_id: 1,
                        message: 'a partagé un objet',
                        timestamp: new Date().toISOString()
                    }
                ];

                commit('SET_INTERACTIONS', mockInteractions);
                commit('SET_LOADING', false);

                return { success: true, interactions: mockInteractions };
            } catch (error) {
                commit('SET_ERROR', error.message);
                commit('SET_LOADING', false);
                return { success: false, error: error.message };
            }
        },

        // Envoyer un message
        async sendMessage({ commit }, messageData) {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);

            try {
                // Ici, on enverrait le message à Supabase
                // const supabaseManager = new SupabaseManager();
                // const result = await supabaseManager.sendMessage(messageData);

                // Pour l'exemple, on simule l'envoi
                const newMessage = {
                    id: Date.now(),
                    ...messageData,
                    read: false,
                    timestamp: new Date().toISOString()
                };

                commit('ADD_MESSAGE', newMessage);
                commit('SET_LOADING', false);

                return { success: true, message: newMessage };
            } catch (error) {
                commit('SET_ERROR', error.message);
                commit('SET_LOADING', false);
                return { success: false, error: error.message };
            }
        },

        // Charger les messages avec un utilisateur
        async loadUserMessages({ commit }, { userId, targetUserId }) {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);

            try {
                // Ici, on chargerait les messages depuis Supabase
                // const supabaseManager = new SupabaseManager();
                // const result = await supabaseManager.loadMessages(userId, targetUserId);

                // Pour l'exemple, on simule le chargement de messages
                const mockMessages = [
                    {
                        id: 1,
                        sender_id: userId,
                        receiver_id: targetUserId,
                        content: 'Bonjour !',
                        read: true,
                        timestamp: new Date().toISOString()
                    },
                    {
                        id: 2,
                        sender_id: targetUserId,
                        receiver_id: userId,
                        content: 'Salut ! Comment ça va ?',
                        read: false,
                        timestamp: new Date().toISOString()
                    }
                ];

                commit('SET_MESSAGES', mockMessages);
                commit('SET_LOADING', false);

                return { success: true, messages: mockMessages };
            } catch (error) {
                commit('SET_ERROR', error.message);
                commit('SET_LOADING', false);
                return { success: false, error: error.message };
            }
        },

        // Marquer un message comme lu
        async markMessageAsRead({ commit }, messageId) {
            try {
                // Ici, on marquerait le message comme lu dans Supabase
                // const supabaseManager = new SupabaseManager();
                // const result = await supabaseManager.markMessageAsRead(messageId);

                // Pour l'exemple, on simule cette action
                commit('MARK_MESSAGE_AS_READ', messageId);
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // Ajouter un ami
        async addFriend({ commit }, friendData) {
            try {
                // Ici, on ajouterait l'ami via Supabase
                // const supabaseManager = new SupabaseManager();
                // const result = await supabaseManager.addFriend(friendData);

                // Pour l'exemple, on simule cette action
                const newFriend = {
                    id: Date.now(),
                    ...friendData
                };

                commit('ADD_FRIEND', newFriend);
                return { success: true, friend: newFriend };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    }
};
