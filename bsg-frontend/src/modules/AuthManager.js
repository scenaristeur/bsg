// Authentification magic link/email/réseaux sociaux
// Flow complet : inscription → vérification → session
// Gestion password reset, email confirmation
// Tests : flux d'auth complets, erreurs

export class AuthManager {
    constructor(supabaseManager) {
        this.supabase = supabaseManager.getClient();
        if (!this.supabase) {
            console.error('Supabase non initialisé dans AuthManager');
        }
    }

    // Inscription d'un nouvel utilisateur
    async signUp(email, password, userData = {}) {
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email,
                password,
                options: {
                    data: userData
                }
            });

            if (error) {
                throw new Error(`Erreur d'inscription: ${error.message}`);
            }

            return { success: true, user: data.user, session: data.session };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Connexion d'un utilisateur
    async signIn(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                throw new Error(`Erreur de connexion: ${error.message}`);
            }

            return { success: true, user: data.user, session: data.session };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Déconnexion
    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();

            if (error) {
                throw new Error(`Erreur de déconnexion: ${error.message}`);
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Récupérer l'utilisateur actuel
    getCurrentUser() {
        return this.supabase.auth.user();
    }

    // Vérifier si l'utilisateur est connecté
    isAuthenticated() {
        return !!this.supabase.auth.user();
    }

    // Réinitialisation du mot de passe
    async resetPassword(email) {
        try {
            const { error } = await this.supabase.auth.resetPasswordForEmail(email);

            if (error) {
                throw new Error(`Erreur de réinitialisation: ${error.message}`);
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Vérification de l'email via le lien de confirmation
    async verifyEmail(token) {
        try {
            const { data, error } = await this.supabase.auth.verifyOtp({
                token,
                type: 'email'
            });

            if (error) {
                throw new Error(`Erreur de vérification: ${error.message}`);
            }

            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Gestion des callbacks d'authentification
    onAuthStateChange(callback) {
        return this.supabase.auth.onAuthStateChange(callback);
    }
}
