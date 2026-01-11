<template>
    <div class="game-interface">
        <!-- Header -->
        <header class="game-header">
            <h1>Bienveillant Seduction Game</h1>
            <div class="user-info">
                <span v-if="currentUser && currentUser.prenom && currentUser.nom">Bienvenue, {{ currentUser.prenom }} {{
                    currentUser.nom }}</span>
                <span v-else>Bienvenue, Invité</span>
                <button @click="logout" class="logout-btn">Déconnexion</button>
            </div>
        </header>

        <!-- Navigation -->
        <nav class="game-nav">
            <button @click="currentView = 'profile'" :class="{ active: currentView === 'profile' }">
                Mon Profil
            </button>
            <button @click="currentView = 'notifications'" :class="{ active: currentView === 'notifications' }">
                Notifications
            </button>
            <button @click="currentView = 'missions'" :class="{ active: currentView === 'missions' }">
                Mes Missions
            </button>
            <button @click="currentView = 'map'" :class="{ active: currentView === 'map' }">
                Carte
            </button>
        </nav>

        <!-- Main Content -->
        <main class="game-content">
            <!-- Profile View -->
            <div v-if="currentView === 'profile'" class="profile-view">
                <h2>Mon Profil</h2>
                <div class="profile-form">
                    <div class="form-group">
                        <label>Nom:</label>
                        <input v-model="userProfile.nom" disabled />
                    </div>
                    <div class="form-group">
                        <label>Prénom:</label>
                        <input v-model="userProfile.prenom" disabled />
                    </div>
                    <div class="form-group">
                        <label>Email:</label>
                        <input v-model="userProfile.email" disabled />
                    </div>
                    <div class="form-group">
                        <label>Date de naissance:</label>
                        <input v-model="userProfile.dateNaissance" type="date" />
                    </div>
                    <div class="form-group">
                        <label>Centres d'intérêt:</label>
                        <textarea v-model="userProfile.interets"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Préférences de rencontre:</label>
                        <select v-model="userProfile.preferencesRencontre">
                            <option value="transport">Transport en commun</option>
                            <option value="lieu">Lieu public</option>
                            <option value="restaurant">Restaurant</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Disponibilité:</label>
                        <input v-model="userProfile.disponibilite" type="text" placeholder="Ex: Soirées, Week-ends" />
                    </div>
                    <button @click="saveProfile" class="save-btn">Sauvegarder</button>
                </div>
            </div>

            <!-- Notifications View -->
            <div v-else-if="currentView === 'notifications'" class="notifications-view">
                <h2>Notifications de Rencontre</h2>
                <div class="notification-card" v-if="activeNotification">
                    <div class="notification-header">
                        <h3>Rendez-vous imminent !</h3>
                        <span class="time">{{ activeNotification.time }}</span>
                    </div>
                    <div class="notification-details">
                        <p><strong>Lieu:</strong> {{ activeNotification.lieu }}</p>
                        <p><strong>Transport:</strong> {{ activeNotification.transport }}</p>
                        <p><strong>Arrêt:</strong> {{ activeNotification.arret }}</p>
                        <p><strong>Instructions:</strong></p>
                        <ul>
                            <li>Direction le fond du bus</li>
                            <li>Rechercher un partenaire avec une <strong>écharpe bleue</strong></li>
                            <li>Utiliser le mot de passe: <strong>"étagère"</strong></li>
                        </ul>
                    </div>
                    <div class="notification-actions">
                        <button @click="acceptMeeting" class="accept-btn">Accepter</button>
                        <button @click="declineMeeting" class="decline-btn">Refuser</button>
                    </div>
                </div>
                <div v-else class="no-notifications">
                    <p>Aucune notification active pour le moment.</p>
                </div>
            </div>

            <!-- Missions View -->
            <div v-else-if="currentView === 'missions'" class="missions-view">
                <h2>Mes Missions</h2>
                <div class="mission-card" v-if="currentMission">
                    <div class="mission-header">
                        <h3>{{ currentMission.titre }}</h3>
                        <span class="difficulty">{{ currentMission.difficulte }}</span>
                    </div>
                    <div class="mission-description">
                        <p>{{ currentMission.description }}</p>
                    </div>
                    <div class="mission-objectives">
                        <h4>Objectifs:</h4>
                        <ul>
                            <li v-for="objectif in currentMission.objectifs" :key="objectif">{{ objectif }}</li>
                        </ul>
                    </div>
                    <div class="mission-hints" v-if="currentMission.indices">
                        <h4>Indices:</h4>
                        <p>{{ currentMission.indices }}</p>
                    </div>
                    <div class="mission-actions">
                        <button @click="startMission" class="start-btn">Commencer la mission</button>
                    </div>
                </div>
                <div v-else class="no-missions">
                    <p>Aucune mission active pour le moment.</p>
                </div>
            </div>

            <!-- Map View -->
            <div v-else-if="currentView === 'map'" class="map-view">
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
        </main>

        <!-- Mission Modal -->
        <div v-if="showMissionModal" class="modal-overlay">
            <div class="mission-modal">
                <h3>Validation de Mission</h3>
                <div class="verification-section">
                    <h4>Vérification d'identité</h4>
                    <p>Entrez le mot de passe pour valider votre identité :</p>
                    <input v-model="verificationPassword" type="password" placeholder="Mot de passe" />
                    <button @click="verifyIdentity" class="verify-btn">Vérifier</button>
                </div>
                <div class="mission-details" v-if="verifiedPartner">
                    <h4>Partenaire identifié</h4>
                    <p>Vous avez rencontré {{ verifiedPartner.nom }} {{ verifiedPartner.prenom }}</p>
                    <p>Informations cruciales pour la mission :</p>
                    <div class="mission-info">
                        <p><strong>Indice :</strong> {{ missionInfo }}</p>
                    </div>
                    <button @click="completeMission" class="complete-btn">Completer la mission</button>
                </div>
                <button @click="closeModal" class="close-btn">Fermer</button>
            </div>
        </div>
    </div>
</template>

<script>
import { useUserStore } from '../stores/user'
import { userService } from '../services/userService'

export default {
    name: 'GameInterface',
    data() {
        return {
            currentView: 'profile',
            activeNotification: null,
            currentMission: null,
            mapMarkers: [],
            showMissionModal: false,
            verificationPassword: '',
            verifiedPartner: null,
            missionInfo: '',
            // Données utilisateur réactives
            userProfile: {
                nom: '',
                prenom: '',
                email: '',
                dateNaissance: '',
                interets: '',
                preferencesRencontre: '',
                disponibilite: ''
            }
        }
    },
    computed: {
        currentUser() {
            const userStore = useUserStore()
            return userStore.currentUser
        }
    },
    async mounted() {
        // Vérifier si l'utilisateur est connecté via le store
        const userStore = useUserStore()
        if (!userStore.isLoggedIn) {
            // Rediriger vers la page de connexion si aucun utilisateur n'est connecté
            this.$router.push('/login')
        }

        // Synchroniser les données utilisateur
        this.syncUserData();

        // Charger les données initiales
        await this.loadInitialData()
    },
    methods: {
        // Méthode pour synchroniser les données utilisateur
        syncUserData() {
            if (this.currentUser) {
                this.userProfile = {
                    nom: this.currentUser.nom || '',
                    prenom: this.currentUser.prenom || '',
                    email: this.currentUser.email || '',
                    dateNaissance: this.currentUser.dateNaissance || '',
                    interets: this.currentUser.interets || '',
                    preferencesRencontre: this.currentUser.preferencesRencontre || '',
                    disponibilite: this.currentUser.disponibilite || ''
                }
            }
        },
        async loadInitialData() {
            try {
                // Charger les marqueurs de la carte
                this.mapMarkers = [
                    { id: 1, type: 'R', label: 'Restaurant', x: 30, y: 40 },
                    { id: 2, type: 'B', label: 'Bar', x: 60, y: 70 },
                    { id: 3, type: 'T', label: 'Transport', x: 80, y: 20 }
                ]

                // Charger la mission actuelle (exemple)
                this.currentMission = {
                    titre: 'Le Mystère du Café',
                    difficulte: 'Facile',
                    description: 'Trouvez l\'indice caché dans le café de la place Bellecour pour découvrir le prochain lieu de la mission.',
                    objectifs: [
                        'Identifier le lieu de la mission',
                        'Trouver l\'indice caché',
                        'Résoudre l\'énigme'
                    ],
                    indices: 'L\'indice est caché dans le café, derrière le bar.'
                }

                // Charger la notification active (exemple)
                this.activeNotification = {
                    time: '18:30',
                    lieu: 'Quartier de la Croix-Rousse',
                    transport: 'Bus 34',
                    arret: 'Lycée Lumière'
                }
            } catch (error) {
                console.error('Erreur lors du chargement des données initiales:', error)
            }
        },
        logout() {
            // Utilisation du store utilisateur pour la déconnexion
            const userStore = useUserStore()
            userStore.logout()

            // Rediriger vers la page de connexion
            this.$router.push('/login')
        },
        async saveProfile() {
            try {
                // Envoyer les modifications au backend
                const userStore = useUserStore()
                console.log('Données envoyées au backend:', {
                    userId: this.currentUser.id,
                    userData: this.userProfile
                });
                const response = await userService.updateUser(this.currentUser.id, this.userProfile)
                // Mettre à jour le store avec les nouvelles données
                userStore.setCurrentUser(response.user)
                alert('Profil sauvegardé avec succès !')
            } catch (error) {
                console.error('Erreur lors de la sauvegarde du profil:', error)
                alert('Erreur lors de la sauvegarde du profil')
            }
        },
        acceptMeeting() {
            alert('Rendez-vous accepté ! Préparez-vous à rencontrer votre partenaire.')
        },
        declineMeeting() {
            alert('Rendez-vous refusé.')
            this.activeNotification = null
        },
        startMission() {
            alert('Mission commencée ! Bonne chance.')
        },
        verifyIdentity() {
            if (this.verificationPassword === 'étagère') {
                this.verifiedPartner = {
                    nom: 'Martin',
                    prenom: 'Pierre'
                }
                this.missionInfo = 'Le prochain lieu est le musée des Beaux-Arts'
            } else {
                alert('Mot de passe incorrect. Veuillez réessayer.')
            }
        },
        completeMission() {
            alert('Mission complétée ! Félicitations.')
            this.showMissionModal = false
            this.verifiedPartner = null
            this.verificationPassword = ''
        },
        closeModal() {
            this.showMissionModal = false
            this.verifiedPartner = null
            this.verificationPassword = ''
        }
    }
}
</script>

<style>
@import './GameInterface.css';
</style>
