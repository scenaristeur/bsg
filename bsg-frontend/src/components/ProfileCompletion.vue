<template>
    <div class="profile-completion">
        <header class="profile-header">
            <h1>Compléter mon profil</h1>
            <p>Remplissez vos informations pour personnaliser votre expérience</p>
        </header>

        <div class="profile-form-container">
            <form @submit.prevent="saveProfile" class="profile-form">
                <!-- Informations personnelles -->
                <section class="profile-section">
                    <h2>Informations Personnelles</h2>

                    <div class="form-group">
                        <label for="pseudo">Pseudo *</label>
                        <input id="pseudo" v-model="formData.pseudo" type="text" required placeholder="Votre pseudo" />
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="nom">Nom *</label>
                            <input id="nom" v-model="formData.nom" type="text" required placeholder="Votre nom" />
                        </div>

                        <div class="form-group">
                            <label for="prenom">Prénom *</label>
                            <input id="prenom" v-model="formData.prenom" type="text" required
                                placeholder="Votre prénom" />
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="email">Email</label>
                        <input id="email" v-model="formData.email" type="email" readonly disabled />
                    </div>
                </section>

                <!-- Compétences -->
                <section class="profile-section">
                    <h2>Compétences</h2>
                    <p class="section-description">Sélectionnez vos compétences principales</p>

                    <div class="skills-container">
                        <div v-for="skill in availableSkills" :key="skill.id" class="skill-tag"
                            :class="{ selected: formData.competences.includes(skill.id) }"
                            @click="toggleSkill(skill.id)">
                            {{ skill.name }}
                        </div>
                    </div>
                </section>

                <!-- Localisation -->
                <section class="profile-section">
                    <h2>Localisation</h2>
                    <p class="section-description">Partagez votre position pour trouver des missions près de chez vous
                    </p>

                    <div class="form-group">
                        <label for="latitude">Latitude</label>
                        <input id="latitude" v-model.number="formData.latitude" type="number" step="0.0000001"
                            placeholder="Latitude" />
                    </div>

                    <div class="form-group">
                        <label for="longitude">Longitude</label>
                        <input id="longitude" v-model.number="formData.longitude" type="number" step="0.0000001"
                            placeholder="Longitude" />
                    </div>

                    <button type="button" @click="getCurrentLocation" class="btn btn-secondary"
                        :disabled="locationLoading">
                        {{ locationLoading ? 'Obtention de la localisation...' : 'Utiliser ma position actuelle' }}
                    </button>
                </section>

                <!-- Actions -->
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary" :disabled="loading">
                        {{ loading ? 'Enregistrement...' : 'Enregistrer mon profil' }}
                    </button>

                    <button type="button" @click="cancelEdit" class="btn btn-secondary">
                        Annuler
                    </button>
                </div>

                <!-- Messages -->
                <div v-if="errorMessage" class="error-message">
                    {{ errorMessage }}
                </div>

                <div v-if="successMessage" class="success-message">
                    {{ successMessage }}
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { authManager } from '../modules/AuthManager'

export default {
    name: 'ProfileCompletion',
    data() {
        return {
            loading: false,
            locationLoading: false,
            errorMessage: null,
            successMessage: null,
            availableSkills: [
                { id: 'exploration', name: 'Exploration' },
                { id: 'communication', name: 'Communication' },
                { id: 'resolution-problemes', name: 'Résolution de problèmes' },
                { id: 'creativite', name: 'Créativité' },
                { id: 'travail-equipe', name: 'Travail d\'équipe' },
                { id: 'organisation', name: 'Organisation' },
                { id: 'adaptabilite', name: 'Adaptabilité' },
                { id: 'leadership', name: 'Leadership' }
            ],
            formData: {
                pseudo: '',
                nom: '',
                prenom: '',
                email: '',
                competences: [],
                latitude: null,
                longitude: null
            }
        }
    },
    computed: {
        ...mapState('auth', ['user']),
        ...mapGetters('auth', ['currentUser'])
    },
    async mounted() {
        // Vérifier que l'utilisateur est bien authentifié
        const isAuthenticated = this.currentUser || this.user;
        if (!isAuthenticated) {
            console.warn('Utilisateur non authentifié, redirection vers /auth');
            this.$router.push('/auth');
            return;
        }

        // Essayer plusieurs fois de synchroniser l'utilisateur
        await this.attemptSyncWithStore();
        await this.loadUserProfile()
    },

    methods: {
        ...mapActions('auth', ['checkAuthStatus']),

        async attemptSyncWithStore() {
            // Essayer de synchroniser plusieurs fois pour s'assurer que l'utilisateur est disponible
            let attempts = 0;
            const maxAttempts = 5;

            const syncAttempt = () => {
                attempts++;
                const user = this.currentUser || this.user;
                console.log(`Tentative ${attempts} de synchronisation - Utilisateur trouvé:`, user);

                if (user) {
                    console.log('Synchronisation avec l\'utilisateur du store:', user);
                    authManager.setCurrentUser(user);
                    return true;
                } else if (attempts < maxAttempts) {
                    // Attendre un peu puis réessayer
                    setTimeout(syncAttempt, 100);
                    return false;
                } else {
                    console.log('Impossible de synchroniser l\'utilisateur après', maxAttempts, 'tentatives');
                    return false;
                }
            };

            return syncAttempt();
        },

        async loadUserProfile() {
            try {
                // Récupérer les données de l'utilisateur depuis le store
                const user = this.currentUser || this.user

                console.log('Chargement du profil - user:', user);

                if (user) {
                    // Combiner les données correctement selon leur origine
                    this.formData = {
                        pseudo: user.pseudo || user.user_metadata?.pseudo || '',
                        nom: user.nom || user.user_metadata?.nom || '',
                        prenom: user.prenom || user.user_metadata?.prenom || '',
                        email: user.email || '',
                        competences: user.competences || [],
                        latitude: user.latitude || null,
                        longitude: user.longitude || null
                    }
                    console.log('Formulaire rempli avec:', this.formData);
                }
            } catch (error) {
                console.error('Erreur lors du chargement du profil:', error)
                this.errorMessage = 'Erreur lors du chargement de votre profil'
            }
        },

        toggleSkill(skillId) {
            const index = this.formData.competences.indexOf(skillId)
            if (index > -1) {
                this.formData.competences.splice(index, 1)
            } else {
                this.formData.competences.push(skillId)
            }
        },

        async getCurrentLocation() {
            this.locationLoading = true
            this.errorMessage = null

            try {
                if (!navigator.geolocation) {
                    throw new Error('La géolocalisation n\'est pas supportée par votre navigateur')
                }

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        console.log('Position obtenue:', position.coords);
                        this.formData.latitude = position.coords.latitude
                        this.formData.longitude = position.coords.longitude
                        this.locationLoading = false
                        this.successMessage = 'Position obtenue avec succès !'
                    },
                    (error) => {
                        this.locationLoading = false
                        console.error('Erreur de géolocalisation:', error);
                        switch (error.code) {
                            case error.PERMISSION_DENIED:
                                this.errorMessage = 'Accès à la localisation refusé par l\'utilisateur'
                                break
                            case error.POSITION_UNAVAILABLE:
                                this.errorMessage = 'Information de localisation indisponible'
                                break
                            case error.TIMEOUT:
                                this.errorMessage = 'Délai d\'attente dépassé'
                                break
                            default:
                                this.errorMessage = 'Erreur inconnue lors de la géolocalisation: ' + error.message
                                break
                        }
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 60000
                    }
                )
            } catch (error) {
                this.locationLoading = false
                console.error('Exception lors de la géolocalisation:', error);
                this.errorMessage = 'Erreur lors de la récupération de la position: ' + error.message
            }
        },

        async saveProfile() {
            this.loading = true
            this.errorMessage = null
            this.successMessage = null

            try {
                console.log('Données à envoyer:', this.formData);

                // Validation des données
                if (!this.formData.pseudo || !this.formData.nom || !this.formData.prenom) {
                    throw new Error('Veuillez remplir tous les champs obligatoires')
                }

                // Mise à jour de l'utilisateur dans Supabase
                const userData = {
                    pseudo: this.formData.pseudo,
                    nom: this.formData.nom,
                    prenom: this.formData.prenom,
                    competences: this.formData.competences,
                    latitude: this.formData.latitude,
                    longitude: this.formData.longitude
                }

                console.log('Données utilisateur à envoyer:', userData);

                // Utiliser le AuthManager pour mettre à jour l'utilisateur
                // Passer l'ID utilisateur pour s'assurer que la mise à jour se fait correctement
                const userDataWithId = {
                    ...userData,
                    id: this.currentUser?.id || this.user?.id
                };
                const result = await authManager.updateUser(userDataWithId)
                console.log('Résultat de la mise à jour:', result);

                if (result.success) {
                    // Mettre à jour le store avec les nouvelles données
                    this.$store.commit('auth/SET_USER', result.user)
                    this.successMessage = 'Profil mis à jour avec succès !'
                    console.log('Profil mis à jour avec succès');

                    // Rediriger vers le profil après un court délai
                    setTimeout(() => {
                        this.$router.push('/profile')
                    }, 1500)
                } else {
                    throw new Error(result.error || 'Erreur lors de la mise à jour du profil')
                }
            } catch (error) {
                console.error('Erreur complète lors de l\'enregistrement du profil:', error)
                this.errorMessage = error.message || 'Erreur lors de l\'enregistrement du profil'
            } finally {
                this.loading = false
            }
        },

        cancelEdit() {
            this.$router.push('/profile')
        }
    }
}
</script>

<style scoped>
.profile-completion {
    min-height: 100vh;
    background-color: #f8f9fa;
}

.profile-header {
    background-color: #fff;
    padding: 1rem 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-header h1 {
    margin: 0 0 0.5rem 0;
    color: #333;
}

.profile-header p {
    margin: 0;
    color: #666;
}

.profile-form-container {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
}

.profile-form {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.profile-section {
    margin-bottom: 2rem;
}

.profile-section h2 {
    margin: 0 0 1rem 0;
    color: #333;
    border-bottom: 2px solid #007bff;
    padding-bottom: 0.5rem;
}

.section-description {
    color: #666;
    margin: 0 0 1rem 0;
    font-style: italic;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #333;
}

.form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.skills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.skill-tag {
    background-color: #e9ecef;
    color: #495057;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    border: 2px solid transparent;
}

.skill-tag:hover {
    background-color: #dee2e6;
}

.skill-tag.selected {
    background-color: #007bff;
    color: white;
    border-color: #0056b3;
}

.form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
}

.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-primary {
    background-color: #007bff;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background-color: #0056b3;
}

.btn-primary:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
}

.btn-secondary:hover:not(:disabled) {
    background-color: #545b62;
}

.btn-secondary:disabled {
    background-color: #adb5bd;
    cursor: not-allowed;
}

.error-message {
    margin-top: 1rem;
    padding: 0.75rem;
    background-color: #f8d7da;
    color: #721c24;
    border-radius: 4px;
    text-align: center;
}

.success-message {
    margin-top: 1rem;
    padding: 0.75rem;
    background-color: #d4edda;
    color: #155724;
    border-radius: 4px;
    text-align: center;
}

@media (max-width: 768px) {
    .profile-form-container {
        padding: 1rem;
    }

    .profile-form {
        padding: 1rem;
    }

    .form-row {
        grid-template-columns: 1fr;
        gap: 0.5rem;
    }

    .form-actions {
        flex-direction: column;
    }
}
</style>
