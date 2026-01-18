// Gestion des missions actives et de leur progression
// Module Vuex pour la gestion d'état des missions

export const missionsModule = {
    namespaced: true,

    state: {
        activeMissions: [],
        completedMissions: [],
        missionProgress: {},
        loading: false,
        error: null
    },

    getters: {
        // Obtenir les missions actives
        activeMissions: (state) => state.activeMissions,

        // Obtenir les missions complétées
        completedMissions: (state) => state.completedMissions,

        // Obtenir la progression d'une mission spécifique
        missionProgress: (state) => (missionId) => state.missionProgress[missionId],

        // Obtenir le nombre total de missions
        totalMissions: (state) => state.activeMissions.length + state.completedMissions.length,

        // Obtenir le nombre de missions actives
        activeMissionCount: (state) => state.activeMissions.length,

        // Obtenir le nombre de missions complétées
        completedMissionCount: (state) => state.completedMissions.length
    },

    mutations: {
        // Définir les missions actives
        SET_ACTIVE_MISSIONS(state, missions) {
            state.activeMissions = missions;
        },

        // Ajouter une mission active
        ADD_ACTIVE_MISSION(state, mission) {
            state.activeMissions.push(mission);
        },

        // Mettre à jour une mission active
        UPDATE_ACTIVE_MISSION(state, mission) {
            const index = state.activeMissions.findIndex(m => m.id === mission.id);
            if (index !== -1) {
                state.activeMissions.splice(index, 1, mission);
            }
        },

        // Supprimer une mission active
        REMOVE_ACTIVE_MISSION(state, missionId) {
            state.activeMissions = state.activeMissions.filter(m => m.id !== missionId);
        },

        // Définir les missions complétées
        SET_COMPLETED_MISSIONS(state, missions) {
            state.completedMissions = missions;
        },

        // Ajouter une mission complétée
        ADD_COMPLETED_MISSION(state, mission) {
            state.completedMissions.push(mission);
        },

        // Mettre à jour la progression d'une mission
        UPDATE_MISSION_PROGRESS(state, { missionId, progress }) {
            state.missionProgress[missionId] = progress;
        },

        // Définir l'état de chargement
        SET_LOADING(state, loading) {
            state.loading = loading;
        },

        // Définir une erreur
        SET_ERROR(state, error) {
            state.error = error;
        },

        // Réinitialiser l'état des missions
        RESET_MISSIONS_STATE(state) {
            state.activeMissions = [];
            state.completedMissions = [];
            state.missionProgress = {};
            state.error = null;
        }
    },

    actions: {
        // Charger les missions d'un utilisateur
        async loadUserMissions({ commit }, userId) {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);

            try {
                // Ici, on utiliserait le MissionEngine pour charger les missions
                // const missionEngine = new MissionEngine(supabaseManager, webhookManager);
                // const result = await missionEngine.getUserMissions(userId);

                // Pour l'exemple, on simule le chargement de missions
                const mockMissions = [
                    {
                        id: 1,
                        titre: 'Mission de test 1',
                        description: 'Description de la première mission',
                        difficulte: 'Facile',
                        objectifs: 'Objectif 1, Objectif 2',
                        indices: 'Indice 1',
                        statut: 'initie',
                        created_at: new Date().toISOString()
                    },
                    {
                        id: 2,
                        titre: 'Mission de test 2',
                        description: 'Description de la deuxième mission',
                        difficulte: 'Moyen',
                        objectifs: 'Objectif 3, Objectif 4',
                        indices: 'Indice 2',
                        statut: 'en_cours',
                        created_at: new Date().toISOString()
                    }
                ];

                commit('SET_ACTIVE_MISSIONS', mockMissions);
                commit('SET_LOADING', false);

                return { success: true, missions: mockMissions };
            } catch (error) {
                commit('SET_ERROR', error.message);
                commit('SET_LOADING', false);
                return { success: false, error: error.message };
            }
        },

        // Créer une nouvelle mission
        async createMission({ commit }, missionData) {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);

            try {
                // Ici, on utiliserait le MissionEngine pour créer la mission
                // const missionEngine = new MissionEngine(supabaseManager, webhookManager);
                // const result = await missionEngine.generateMission(userId, location, preferences);

                // Pour l'exemple, on simule la création d'une mission
                const newMission = {
                    id: Date.now(),
                    ...missionData,
                    statut: 'initie',
                    created_at: new Date().toISOString()
                };

                commit('ADD_ACTIVE_MISSION', newMission);
                commit('SET_LOADING', false);

                return { success: true, mission: newMission };
            } catch (error) {
                commit('SET_ERROR', error.message);
                commit('SET_LOADING', false);
                return { success: false, error: error.message };
            }
        },

        // Mettre à jour le statut d'une mission
        async updateMissionStatus({ commit }, { missionId, status }) {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);

            try {
                // Ici, on utiliserait le MissionEngine pour mettre à jour le statut
                // const missionEngine = new MissionEngine(supabaseManager, webhookManager);
                // const result = await missionEngine.updateMissionStatus(missionId, status);

                // Pour l'exemple, on simule la mise à jour du statut
                const updatedMission = {
                    id: missionId,
                    statut: status
                };

                commit('UPDATE_ACTIVE_MISSION', updatedMission);
                commit('SET_LOADING', false);

                return { success: true, mission: updatedMission };
            } catch (error) {
                commit('SET_ERROR', error.message);
                commit('SET_LOADING', false);
                return { success: false, error: error.message };
            }
        },

        // Mettre à jour la progression d'une mission
        async updateMissionProgress({ commit }, { missionId, progress }) {
            try {
                commit('UPDATE_MISSION_PROGRESS', { missionId, progress });
                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // Compléter une mission
        async completeMission({ commit }, missionId) {
            try {
                // Ici, on déplacerait la mission de active à complétée
                // Pour l'exemple, on simule cette action

                commit('REMOVE_ACTIVE_MISSION', missionId);
                // Dans une implémentation réelle, on ajouterait la mission à completedMissions

                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    }
};
