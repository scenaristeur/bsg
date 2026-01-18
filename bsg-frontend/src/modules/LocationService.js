// Géolocalisation avec Leaflet/OpenStreetMap
// Calcul distances, recherche POIs proches
// Tests : précision, permissions, offline

export class LocationService {
    constructor() {
        this.currentPosition = null;
        this.watchId = null;
    }

    // Demander la permission de géolocalisation
    async requestPermission() {
        try {
            if (!navigator.geolocation) {
                throw new Error('La géolocalisation n\'est pas supportée par ce navigateur');
            }

            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.currentPosition = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                            timestamp: position.timestamp
                        };
                        resolve(this.currentPosition);
                    },
                    (error) => {
                        reject(new Error(`Erreur de géolocalisation: ${error.message}`));
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 60000
                    }
                );
            });
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Suivre la position de l'utilisateur
    watchPosition(callback) {
        if (!navigator.geolocation) {
            callback({ success: false, error: 'La géolocalisation n\'est pas supportée' });
            return;
        }

        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                this.currentPosition = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp
                };
                callback({ success: true, position: this.currentPosition });
            },
            (error) => {
                callback({ success: false, error: error.message });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    }

    // Arrêter de suivre la position
    clearWatch() {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }

    // Calculer la distance entre deux points (formule de Haversine)
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Rayon de la Terre en km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d; // Distance en km
    }

    // Conversion de degrés en radians
    toRad(degrees) {
        return degrees * Math.PI / 180;
    }

    // Vérifier si l'utilisateur est dans une zone donnée
    isInZone(userPosition, zoneCenter, radius) {
        const distance = this.calculateDistance(
            userPosition.latitude,
            userPosition.longitude,
            zoneCenter.latitude,
            zoneCenter.longitude
        );
        return distance <= radius;
    }

    // Récupérer les POIs proches avec Supabase
    async getNearbyPOIs(supabaseManager, radius = 1000) {
        try {
            if (!this.currentPosition) {
                throw new Error('Aucune position actuelle disponible');
            }

            const result = await supabaseManager.getNearbyPOIs(
                this.currentPosition.latitude,
                this.currentPosition.longitude,
                radius
            );

            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Obtenir la position actuelle
    getCurrentPosition() {
        return this.currentPosition;
    }

    // Vérifier si la géolocalisation est disponible
    isGeolocationAvailable() {
        return !!navigator.geolocation;
    }

    // Vérifier si l'utilisateur a accordé la permission
    async hasPermission() {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve(false);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                () => resolve(true),
                () => resolve(false),
                { timeout: 1 }
            );
        });
    }
}
