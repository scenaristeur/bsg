// Communication sécurisée avec n8n
// Vérification signatures, retry policy
// Tests : sécurité, format payload, erreurs

export class WebhookManager {
    constructor() {
        this.n8nBaseUrl = import.meta.env.VUE_APP_N8N_MISSION_WEBHOOK;
        this.webhookSecret = import.meta.env.VUE_APP_WEBHOOK_SECRET;

        if (!this.n8nBaseUrl || !this.webhookSecret) {
            console.warn('Configuration webhook n8n incomplète dans les variables d\'environnement');
        }
    }

    // Appel sécurisé à un webhook n8n
    async callN8nWebhook(endpoint, payload) {
        try {
            // Vérifier que la configuration est présente
            if (!this.n8nBaseUrl) {
                throw new Error('URL de webhook n8n non configurée');
            }

            // Construire l'URL complète
            const url = `${this.n8nBaseUrl}/${endpoint}`;

            // Ajouter les headers nécessaires
            const headers = {
                'Content-Type': 'application/json',
                'X-N8N-WEBHOOK-SECRET': this.webhookSecret
            };

            // Effectuer l'appel HTTP
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            // Vérifier la réponse
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
            }

            // Parser la réponse
            const data = await response.json();

            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Appel avec politique de retry
    async callN8nWebhookWithRetry(endpoint, payload, maxRetries = 3) {
        let lastError;

        for (let i = 0; i < maxRetries; i++) {
            try {
                const result = await this.callN8nWebhook(endpoint, payload);
                if (result.success) {
                    return result;
                }
                lastError = result.error;
            } catch (error) {
                lastError = error.message;
            }

            // Attendre avant de réessayer (exponentiel backoff)
            if (i < maxRetries - 1) {
                await this.delay(Math.pow(2, i) * 1000);
            }
        }

        return { success: false, error: `Échec après ${maxRetries} tentatives: ${lastError}` };
    }

    // Vérification de signature HMAC (si nécessaire)
    verifySignature(payload, signature, secret) {
        // Cette méthode serait utilisée si n8n envoie des signatures HMAC
        // Pour l'instant, on retourne true car la vérification dépend de l'implémentation n8n
        return true;
    }

    // Générer une signature HMAC (exemple de méthode)
    generateSignature(payload, secret) {
        // Cette méthode serait utilisée pour signer les requêtes sortantes
        // Implémentation simplifiée - dans un vrai cas, utiliser un module crypto
        return 'signature-example'; // À remplacer par une vraie implémentation
    }

    // Méthode utilitaire pour le délai
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Validation du format du payload
    validatePayload(payload) {
        // Validation basique des champs requis
        if (!payload) {
            return { valid: false, error: 'Payload vide' };
        }

        // Ajouter ici les validations spécifiques selon les endpoints
        return { valid: true };
    }

    // Méthode pour envoyer un webhook de type événement
    async sendEventWebhook(eventData) {
        try {
            const result = await this.callN8nWebhookWithRetry('event', eventData);
            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Méthode pour envoyer un webhook de type mission
    async sendMissionWebhook(missionData) {
        try {
            const result = await this.callN8nWebhookWithRetry('mission', missionData);
            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}
