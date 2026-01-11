<template>
    <div class="map-view">
        <h2>Carte Interactive</h2>
        <div id="map" ref="mapElement" style="height: 400px; width: 100%;"></div>
        <div class="map-info">
            <p>Localisation de l'utilisateur : <span id="user-location">{{ userLocation }}</span></p>
            <p>Lieux marqués : {{ locations.length }} points</p>
            <p>Événements : {{ events.length }} points</p>
            <p>Autres utilisateurs : {{ otherUsers.length }} points</p>
        </div>
    </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
    name: 'MapView',
    data() {
        return {
            map: null,
            userLocation: 'En attente...',
            // Types de marqueurs différents
            locations: [
                { id: 1, type: 'restaurant', label: 'Restaurant', lat: 45.764043, lng: 4.835659, icon: '🍽️' },
                { id: 2, type: 'bar', label: 'Bar', lat: 45.758896, lng: 4.832222, icon: '🍺' },
                { id: 3, type: 'transport', label: 'Station de métro', lat: 45.750000, lng: 4.850000, icon: '🚇' }
            ],
            events: [
                { id: 1, type: 'event', label: 'Soirée cinéma', lat: 45.760000, lng: 4.840000, icon: '🎬' },
                { id: 2, type: 'event', label: 'Concert', lat: 45.755000, lng: 4.830000, icon: '🎵' }
            ],
            otherUsers: [
                { id: 1, type: 'user', label: 'Utilisateur 1', lat: 45.762000, lng: 4.838000, icon: '👤' },
                { id: 2, type: 'user', label: 'Utilisateur 2', lat: 45.757000, lng: 4.835000, icon: '👤' }
            ],
            userMarker: null,
            locationMarkers: [],
            eventMarkers: [],
            userMarkers: []
        }
    },
    mounted() {
        this.initMap()
        this.locateUser()
        this.addMarkers()
    },
    methods: {
        initMap() {
            // Initialisation de la carte OpenStreetMap centrée sur Lyon
            this.map = L.map(this.$refs.mapElement).setView([45.764043, 4.835659], 13)

            // Ajout de la couche OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map)
        },
        locateUser() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude
                        const lng = position.coords.longitude
                        this.userLocation = `${lat.toFixed(4)}, ${lng.toFixed(4)}`

                        // Centrer la carte sur l'utilisateur
                        this.map.setView([lat, lng], 15)

                        // Ajouter un marqueur pour l'utilisateur
                        if (this.userMarker) {
                            this.map.removeLayer(this.userMarker)
                        }

                        // Création d'un marqueur personnalisé pour l'utilisateur
                        const userIcon = L.divIcon({
                            className: 'custom-user-icon',
                            html: '<div style="background-color: #007bff; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold;">👤</div>',
                            iconSize: [30, 30],
                            iconAnchor: [15, 15]
                        })

                        this.userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(this.map)
                            .bindPopup('Votre position actuelle')
                            .openPopup()
                    },
                    (error) => {
                        console.error('Erreur de géolocalisation:', error)
                        this.userLocation = 'Impossible de localiser l\'utilisateur'
                    }
                )
            } else {
                this.userLocation = 'La géolocalisation n\'est pas supportée'
            }
        },
        addMarkers() {
            // Ajouter les marqueurs de lieux
            this.locations.forEach(location => {
                const locationIcon = L.divIcon({
                    className: 'custom-location-icon',
                    html: `<div style="background-color: #28a745; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold;">${location.icon}</div>`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                })

                const markerElement = L.marker([location.lat, location.lng], { icon: locationIcon }).addTo(this.map)
                    .bindPopup(`<b>${location.label}</b><br>Type: ${location.type}`)

                this.locationMarkers.push(markerElement)
            })

            // Ajouter les marqueurs d'événements
            this.events.forEach(event => {
                const eventIcon = L.divIcon({
                    className: 'custom-event-icon',
                    html: `<div style="background-color: #ffc107; color: #212529; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold;">${event.icon}</div>`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                })

                const markerElement = L.marker([event.lat, event.lng], { icon: eventIcon }).addTo(this.map)
                    .bindPopup(`<b>${event.label}</b><br>Type: ${event.type}`)

                this.eventMarkers.push(markerElement)
            })

            // Ajouter les marqueurs d'autres utilisateurs
            this.otherUsers.forEach(user => {
                const userIcon = L.divIcon({
                    className: 'custom-user-icon',
                    html: `<div style="background-color: #dc3545; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold;">${user.icon}</div>`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                })

                const markerElement = L.marker([user.lat, user.lng], { icon: userIcon }).addTo(this.map)
                    .bindPopup(`<b>${user.label}</b><br>Type: ${user.type}`)

                this.userMarkers.push(markerElement)
            })
        }
    }
}
</script>

<style scoped>
.map-view {
    padding: 1rem;
}

.map-info {
    margin-top: 1rem;
    padding: 0.5rem;
    background-color: #f8f9fa;
    border-radius: 4px;
}

.map-info p {
    margin: 0.25rem 0;
    color: #333;
}

/* Personnalisation des icônes */
.custom-user-icon {
    background-color: #007bff;
    color: white;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

.custom-location-icon {
    background-color: #28a745;
    color: white;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

.custom-event-icon {
    background-color: #ffc107;
    color: #212529;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}
</style>
