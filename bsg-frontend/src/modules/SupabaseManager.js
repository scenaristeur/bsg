// Gère toutes les interactions Supabase
// Méthodes : init(), testConnection(), getNearbyPOIs(), logEvent()

export class SupabaseManager {
    constructor() {
        // Initialisation de Supabase
        this.supabaseUrl = import.meta.env.VUE_APP_SUPABASE_URL;
        this.supabaseAnonKey = import.meta.env.VUE_APP_SUPABASE_ANON_KEY;

        if (!this.supabaseUrl || !this.supabaseAnonKey) {
            console.error('Supabase URL ou clé anonyme manquante dans les variables d\'environnement');
        }

        // Importer Supabase client dynamiquement
        this.supabase = null;
        this.init();
    }

    async init() {
        try {
            const { createClient } = await import('@supabase/supabase-js');
            this.supabase = createClient(this.supabaseUrl, this.supabaseAnonKey);
            console.log('Supabase client initialisé avec succès');
        } catch (error) {
            console.error('Erreur lors de l\'initialisation de Supabase:', error);
        }
    }

    // Test de connexion à Supabase
    async testConnection() {
        try {
            if (!this.supabase) {
                throw new Error('Supabase non initialisé');
            }

            const { data, error } = await this.supabase
                .from('users')
                .select('id')
                .limit(1);

            if (error) {
                throw new Error(`Erreur de connexion: ${error.message}`);
            }

            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Récupérer les POIs proches
    async getNearbyPOIs(latitude, longitude, radius = 1000) {
        try {
            if (!this.supabase) {
                throw new Error('Supabase non initialisé');
            }

            // Utilisation de PostGIS pour les requêtes géolocalisées
            const { data, error } = await this.supabase
                .rpc('get_nearby_pois', {
                    lat: latitude,
                    lng: longitude,
                    radius_meters: radius
                });

            if (error) {
                throw new Error(`Erreur lors de la récupération des POIs: ${error.message}`);
            }

            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Journaliser un événement
    async logEvent(eventData) {
        try {
            if (!this.supabase) {
                throw new Error('Supabase non initialisé');
            }

            const { data, error } = await this.supabase
                .from('events')
                .insert([eventData]);

            if (error) {
                throw new Error(`Erreur lors de la journalisation: ${error.message}`);
            }

            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Méthode pour obtenir l'instance Supabase
    getClient() {
        return this.supabase;
    }
}
