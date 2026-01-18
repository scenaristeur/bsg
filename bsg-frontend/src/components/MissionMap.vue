<template>
    <div class="mission-map">
        <header class="map-header">
            <h2>Carte des Missions</h2>
            <div class="map-controls">
                <button @click="centerOnUser" class="btn-secondary">
                    Centrer sur moi
                </button>
                <button @click="refreshPOIs" class="btn-outline">
                    Actualiser
                </button>
            </div>
        </header>

        <div class="map-container">
            <!-- Carte Leaflet -->
            <div id="map" ref="mapElement" class="leaflet-map"></div>

            <!-- Panneau latéral avec POIs -->
            <div class="poi-sidebar">
                <h3>Points d'intérêt à proximité</h3>
                <div v-if="loadingPOIs" class="loading">
                    Chargement des points d'intérêt...
                </div>
                <div v-else-if="visiblePOIs.length === 0" class="empty-state">
                    Aucun point d'intérêt trouvé à proximité.
                </div>
                <div v-else class="poi-list">
                    <div v-for="poi in visiblePOIs" :key="poi.id"
                        :class="['poi-item', { selected: selectedPOI?.id === poi.id }]" @click="selectPOI(poi)">
                        <h4>{{ poi.name }}</h4>
                        <p class="poi-type">{{ poi.type }}</p>
                        <p class="poi-description">{{ poi.description }}</p>
                        <div class="poi-distance">
                            Distance: {{ calculateDistance(poi) }}m
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
    name: 'MissionMap',
    data() {
        return {
            map: null,
            markers: [],
            loadingPOIs: false
        }
    },
    computed: {
        ...mapState('map', ['center', 'zoom', 'visiblePOIs', 'selectedPOI']),
        ...mapGetters('map', ['mapCenter', 'mapZoom'])
    },
    watch: {
        // Surveiller les changements de position centrale de la carte
        mapCenter(newCenter) {
            if (this.map && newCenter) {
                this.map.setView(newCenter, this.mapZoom)
            }
        },
        // Surveiller les changements de zoom
        mapZoom(newZoom) {
            if (this.map) {
                this.map.setZoom(newZoom)
            }
        }
    },
    mounted() {
        this.initMap()
        this.loadInitialPOIs()
    },
    beforeDestroy() {
        if (this.map) {
            this.map.remove()
        }
    },
    methods: {
        ...mapActions('map', [
            'updateMapCenter',
            'updateMapZoom',
            'selectPOI',
            'loadNearbyPOIs',
            'refreshPOIs'
        ]),

        initMap() {
            // Initialiser la carte Leaflet
            this.map = L.map(this.$refs.mapElement).setView([45.764043, 4.835659], 13)

            // Ajouter la couche de tuiles OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map)

            // Gérer les événements de la carte
            this.map.on('moveend', () => {
                const center = this.map.getCenter()
                this.updateMapCenter([center.lat, center.lng])
            })

            this.map.on('zoomend', () => {
                const zoom = this.map.getZoom()
                this.updateMapZoom(zoom)
            })
        },

        async loadInitialPOIs() {
            this.loadingPOIs = true
            try {
                // Charger les POIs autour de la position actuelle
                const result = await this.loadNearbyPOIs({
                    latitude: this.center[0],
                    longitude: this.center[1],
                    radius: 1000
                })
                if (result.success) {
                    this.visiblePOIs = result.pois
                }
            } catch (error) {
                console.error('Erreur lors du chargement des POIs:', error)
            } finally {
                this.loadingPOIs = false
            }
        },

        async refreshPOIs() {
            this.loadingPOIs = true
            try {
                const center = this.map.getCenter()
                const result = await this.refreshPOIs({
                    latitude: center.lat,
                    longitude: center.lng
                })
                if (result.success) {
                    this.visiblePOIs = result.pois
                }
            } catch (error) {
                console.error('Erreur lors de l\'actualisation des POIs:', error)
            } finally {
                this.loadingPOIs = false
            }
        },

        centerOnUser() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude
                        const lng = position.coords.longitude
                        this.map.setView([lat, lng], 15)
                        this.updateMapCenter([lat, lng])
                    },
                    (error) => {
                        console.error('Erreur de géolocalisation:', error)
                    }
                )
            }
        },

        selectPOI(poi) {
            this.selectPOI(poi)
            // Centrer la carte sur le POI sélectionné
            this.map.setView(poi.coordinates, 15)
        },

        calculateDistance(poi) {
            // Calculer la distance approximative en mètres
            if (!this.center) return 0

            const lat1 = this.center[0]
            const lon1 = this.center[1]
            const lat2 = poi.coordinates[0]
            const lon2 = poi.coordinates[1]

            const R = 6371e3 // Rayon de la Terre en mètres
            const φ1 = lat1 * Math.PI / 180
            const φ2 = lat2 * Math.PI / 180
            const Δφ = (lat2 - lat1) * Math.PI / 180
            const Δλ = (lon2 - lon1) * Math.PI / 180

            const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

            return Math.round(R * c)
        }
    }
}
</script>

<style scoped>
.mission-map {
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.map-header {
    background-color: #fff;
    padding: 1rem 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.map-header h2 {
    margin: 0;
    color: #333;
}

.map-controls {
    display: flex;
    gap: 0.5rem;
}

.btn-secondary {
    padding: 0.5rem 1rem;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-secondary:hover {
    background-color: #545b62;
}

.btn-outline {
    padding: 0.5rem 1rem;
    background-color: transparent;
    color: #007bff;
    border: 1px solid #007bff;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-outline:hover {
    background-color: #007bff;
    color: white;
}

.map-container {
    display: flex;
    flex: 1;
    overflow: hidden;
}

.leaflet-map {
    flex: 1;
    z-index: 0;
}

.poi-sidebar {
    width: 300px;
    background-color: #fff;
    box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    overflow-y: auto;
}

.poi-sidebar h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #333;
}

.poi-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.poi-item {
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
}

.poi-item:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-color: #007bff;
}

.poi-item.selected {
    border-color: #007bff;
    background-color: #e3f2fd;
}

.poi-item h4 {
    margin: 0 0 0.5rem 0;
    color: #333;
}

.poi-type {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    color: #007bff;
    font-weight: bold;
}

.poi-description {
    margin: 0 0 0.5rem 0;
    color: #666;
    font-size: 0.9rem;
}

.poi-distance {
    margin: 0;
    font-size: 0.8rem;
    color: #666;
}

.loading,
.empty-state {
    text-align: center;
    padding: 1rem;
    color: #666;
}
</style>
