// État de la carte et des POIs visibles
// Module Vuex pour la gestion d'état de la carte

export const mapModule = {
    namespaced: true,

    state: {
        center: [45.764043, 4.835659], // Coordonnées de Lyon par défaut
        zoom: 13,
        visiblePOIs: [],
        selectedPOI: null,
        loading: false,
        error: null
    },

    getters: {
        // Obtenir le centre de la carte
        mapCenter: (state) => state.center,

        // Obtenir le niveau de zoom
        mapZoom: (state) => state.zoom,

        // Obtenir les POIs visibles
        visiblePOIs: (state) => state.visiblePOIs,

        // Obtenir le POI sélectionné
        selectedPOI: (state) => state.selectedPOI,

        // Vérifier si la carte est en cours de chargement
        isMapLoading: (state) => state.loading
    },

    mutations: {
        // Définir le centre de la carte
        SET_MAP_CENTER(state, center) {
            state.center = center;
        },

        // Définir le niveau de zoom
        SET_MAP_ZOOM(state, zoom) {
            state.zoom = zoom;
        },

        // Définir les POIs visibles
        SET_VISIBLE_POIS(state, pois) {
            state.visiblePOIs = pois;
        },

        // Ajouter un POI visible
        ADD_VISIBLE_POI(state, poi) {
            state.visiblePOIs.push(poi);
        },

        // Supprimer un POI visible
        REMOVE_VISIBLE_POI(state, poiId) {
            state.visiblePOIs = state.visiblePOIs.filter(poi => poi.id !== poiId);
        },

        // Sélectionner un POI
        SELECT_POI(state, poi) {
            state.selectedPOI = poi;
        },

        // Désélectionner le POI
        DESELECT_POI(state) {
            state.selectedPOI = null;
        },

        // Définir l'état de chargement
        SET_LOADING(state, loading) {
            state.loading = loading;
        },

        // Définir une erreur
        SET_ERROR(state, error) {
            state.error = error;
        },

        // Réinitialiser l'état de la carte
        RESET_MAP_STATE(state) {
            state.center = [45.764043, 4.835659];
            state.zoom = 13;
            state.visiblePOIs = [];
            state.selectedPOI = null;
            state.error = null;
        }
    },

    actions: {
        // Charger les POIs proches de la position
        async loadNearbyPOIs({ commit }, { latitude, longitude, radius = 1000 }) {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);

            try {
                // Ici, on utiliserait le LocationService pour charger les POIs
                // const locationService = new LocationService();
                // const result = await locationService.getNearbyPOIs(supabaseManager, radius);

                // Pour l'exemple, on simule le chargement de POIs
                const mockPOIs = [
                    {
                        id: 1,
                        name: 'Musée des Beaux-Arts',
                        coordinates: [45.764043, 4.835659],
                        type: 'culture',
                        description: 'Musée d\'art français'
                    },
                    {
                        id: 2,
                        name: 'Café de la Place Bellecour',
                        coordinates: [45.764543, 4.836659],
                        type: 'restaurant',
                        description: 'Café animé de la place'
                    }
                ];

                commit('SET_VISIBLE_POIS', mockPOIs);
                commit('SET_LOADING', false);

                return { success: true, pois: mockPOIs };
            } catch (error) {
                commit('SET_ERROR', error.message);
                commit('SET_LOADING', false);
                return { success: false, error: error.message };
            }
        },

        // Mettre à jour le centre de la carte
        updateMapCenter({ commit }, center) {
            commit('SET_MAP_CENTER', center);
        },

        // Mettre à jour le niveau de zoom
        updateMapZoom({ commit }, zoom) {
            commit('SET_MAP_ZOOM', zoom);
        },

        // Sélectionner un POI
        selectPOI({ commit }, poi) {
            commit('SELECT_POI', poi);
        },

        // Désélectionner le POI
        deselectPOI({ commit }) {
            commit('DESELECT_POI');
        },

        // Recharger les POIs autour d'une position
        async refreshPOIs({ commit }, { latitude, longitude }) {
            try {
                // Ici, on recharge les POIs autour de la nouvelle position
                // Pour l'exemple, on simule cette action

                const mockPOIs = [
                    {
                        id: 3,
                        name: 'Parc de la Tête d\'Or',
                        coordinates: [45.758043, 4.830659],
                        type: 'nature',
                        description: 'Grand parc lyonnais'
                    }
                ];

                commit('SET_VISIBLE_POIS', mockPOIs);
                return { success: true, pois: mockPOIs };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
    }
};
