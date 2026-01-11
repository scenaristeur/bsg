<template>
    <div class="map-view">
        <h2>Carte de Lyon</h2>
        <div class="map-container">
            <div class="map-placeholder">
                <p>Carte interactive de Lyon avec les lieux de rencontre et missions</p>
                <p>Lieux marqués: {{ mapMarkers.length }} points</p>
            </div>
            <div class="map-markers">
                <div v-for="marker in mapMarkers" :key="marker.id" class="map-marker"
                    :style="{ left: marker.x + '%', top: marker.y + '%' }">
                    <div class="marker-icon">{{ marker.type }}</div>
                    <div class="marker-label">{{ marker.label }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MapView',
    data() {
        return {
            mapMarkers: [
                { id: 1, type: 'R', label: 'Restaurant', x: 30, y: 40 },
                { id: 2, type: 'B', label: 'Bar', x: 60, y: 70 },
                { id: 3, type: 'T', label: 'Transport', x: 80, y: 20 }
            ]
        }
    }
}
</script>

<style scoped>
.map-view {
    padding: 1rem;
}

.map-container {
    position: relative;
    border: 1px solid #ddd;
    border-radius: 8px;
    height: 400px;
    background-color: #e9ecef;
    overflow: hidden;
}

.map-placeholder {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #6c757d;
}

.map-markers {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.map-marker {
    position: absolute;
    transform: translate(-50%, -50%);
    cursor: pointer;
}

.marker-icon {
    width: 30px;
    height: 30px;
    background-color: #007bff;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.8rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.marker-label {
    position: absolute;
    top: 35px;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
