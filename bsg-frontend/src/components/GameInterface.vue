<template>
    <div class="game-interface">
        <!-- Header -->
        <header class="game-header">
            <h1>Bienveillant Seduction Game</h1>
            <div class="user-info">
                <span v-if="currentUser && currentUser.prenom && currentUser.nom">Bienvenue, {{ currentUser.prenom }} {{
                    currentUser.nom }}</span>
                <span v-else-if="currentUser && currentUser.pseudo">Bienvenue, {{ currentUser.pseudo }}</span>
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
            <ProfileView v-if="currentView === 'profile'" />
            <NotificationsView v-else-if="currentView === 'notifications'" />
            <MissionsView v-else-if="currentView === 'missions'" />
            <MapView v-else-if="currentView === 'map'" />
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
import ProfileView from './game/ProfileView.vue'
import NotificationsView from './game/NotificationsView.vue'
import MissionsView from './game/MissionsView.vue'
import MapView from './game/MapView.vue'

export default {
    name: 'GameInterface',
    components: {
        ProfileView,
        NotificationsView,
        MissionsView,
        MapView
    },
    data() {
        return {
            currentView: 'profile',
            showMissionModal: false,
            verificationPassword: '',
            verifiedPartner: null,
            missionInfo: ''
        }
    },
    computed: {
        currentUser() {
            const userStore = useUserStore()
            return userStore.currentUser
        }
    },
    methods: {
        logout() {
            // Utilisation du store utilisateur pour la déconnexion
            const userStore = useUserStore()
            userStore.logout()

            // Rediriger vers la page de connexion
            this.$router.push('/login')
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

<style scoped>
.game-interface {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.game-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.game-header h1 {
    margin: 0;
    color: #333;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.logout-btn {
    padding: 0.5rem 1rem;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.logout-btn:hover {
    background-color: #c82333;
}

.game-nav {
    display: flex;
    background-color: #e9ecef;
    padding: 0.5rem;
    gap: 0.25rem;
}

.game-nav button {
    padding: 0.5rem 1rem;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.game-nav button:hover {
    background-color: #5a6268;
}

.game-nav button.active {
    background-color: #007bff;
}

.game-content {
    flex: 1;
    padding: 1rem;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.mission-modal {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 90%;
}

.verification-section {
    margin-bottom: 1rem;
}

.mission-details {
    margin-bottom: 1rem;
}

.mission-info {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem 0;
}

.close-btn {
    padding: 0.5rem 1rem;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.close-btn:hover {
    background-color: #5a6268;
}
</style>
