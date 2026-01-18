// Gestionnaire de notifications simplifié pour l'application BSG
// Ce module gère les notifications de manière simple sans WebSocket

class NotificationHandler {
    constructor() {
        this.subscribers = [];
    }

    /**
     * S'inscrire aux notifications
     * @param {Function} callback - Fonction de callback pour traiter les notifications
     */
    subscribe(callback) {
        if (typeof callback === 'function') {
            this.subscribers.push(callback);
        }
    }

    /**
     * Se désinscrire d'une notification
     * @param {Function} callback - Fonction de callback à supprimer
     */
    unsubscribe(callback) {
        this.subscribers = this.subscribers.filter(sub => sub !== callback);
    }

    /**
     * Notifier tous les abonnés
     * @param {Object} notification - Données de la notification
     */
    notifySubscribers(notification) {
        this.subscribers.forEach(callback => {
            try {
                callback(notification);
            } catch (error) {
                console.error('Erreur dans le callback de notification:', error);
            }
        });
    }

    /**
     * Afficher une notification simple
     * @param {string} message - Message de la notification
     */
    showNotification(message) {
        console.log('Notification:', message);
        // Ici, vous pourriez implémenter une notification visuelle
        // Pour l'instant, on se contente d'afficher dans la console
    }
}

// Exportation singleton
export const notificationHandler = new NotificationHandler();
