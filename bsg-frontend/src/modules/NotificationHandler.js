// Browser Push API + fallback in-app
// Gestion permissions, templates
// Tests : permissions, affichage, click

export class NotificationHandler {
    constructor() {
        this.isSupported = this.checkBrowserSupport();
        this.permission = 'default'; // default, granted, denied

        if (this.isSupported) {
            this.init();
        }
    }

    // Vérifier la compatibilité du navigateur
    checkBrowserSupport() {
        return 'serviceWorker' in navigator && 'PushManager' in window;
    }

    // Initialisation du gestionnaire de notifications
    async init() {
        try {
            // Vérifier l'état des permissions
            if (Notification.permission !== 'denied') {
                this.permission = Notification.permission;
            }

            // Enregistrer le service worker si disponible
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.register('/service-worker.js');
                console.log('Service worker enregistré:', registration);
            }
        } catch (error) {
            console.error('Erreur lors de l\'initialisation des notifications:', error);
        }
    }

    // Demander la permission pour les notifications
    async requestPermission() {
        try {
            if (!this.isSupported) {
                throw new Error('Les notifications ne sont pas supportées par ce navigateur');
            }

            const permission = await Notification.requestPermission();
            this.permission = permission;

            return { success: true, permission: permission };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Vérifier si les notifications sont autorisées
    isPermissionGranted() {
        return this.permission === 'granted';
    }

    // Afficher une notification browser
    async showBrowserNotification(title, options = {}) {
        try {
            if (!this.isSupported || !this.isPermissionGranted()) {
                throw new Error('Notifications non autorisées ou non supportées');
            }

            // Options par défaut
            const defaultOptions = {
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                silent: false,
                ...options
            };

            // Afficher la notification
            const notification = new Notification(title, defaultOptions);

            // Gérer le clic sur la notification
            notification.onclick = function (event) {
                event.preventDefault();
                if (options.onClick) {
                    options.onClick(event);
                }
                window.focus();
            };

            return { success: true, notification: notification };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Afficher une notification en fallback in-app
    showInAppNotification(message, type = 'info', duration = 5000) {
        try {
            // Créer un élément de notification
            const notificationContainer = document.getElementById('notification-container');
            const notificationElement = document.createElement('div');

            // Appliquer les styles selon le type
            notificationElement.className = `notification notification-${type}`;
            notificationElement.innerHTML = `
        <div class="notification-content">${message}</div>
        <button class="notification-close">&times;</button>
      `;

            // Ajouter à l'élément container
            if (notificationContainer) {
                notificationContainer.appendChild(notificationElement);
            } else {
                // Si aucun container n'existe, créer un container temporaire
                const container = document.createElement('div');
                container.id = 'notification-container';
                container.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
        `;
                container.appendChild(notificationElement);
                document.body.appendChild(container);
            }

            // Fermer automatiquement si durée spécifiée
            if (duration > 0) {
                setTimeout(() => {
                    this.hideInAppNotification(notificationElement);
                }, duration);
            }

            // Gestion du bouton fermer
            const closeButton = notificationElement.querySelector('.notification-close');
            closeButton.addEventListener('click', () => {
                this.hideInAppNotification(notificationElement);
            });

            return { success: true, element: notificationElement };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Masquer une notification in-app
    hideInAppNotification(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    // Afficher une notification complète (browser ou fallback)
    async showNotification(title, message, options = {}) {
        try {
            // Essayer d'afficher une notification browser
            const browserResult = await this.showBrowserNotification(title, {
                body: message,
                ...options
            });

            if (browserResult.success) {
                return browserResult;
            }

            // Si échec, utiliser le fallback in-app
            const inAppResult = this.showInAppNotification(message, options.type || 'info', options.duration || 5000);
            return inAppResult;
        } catch (error) {
            // En dernier recours, afficher dans la console
            console.log(`Notification (${title}): ${message}`);
            return { success: false, error: error.message };
        }
    }

    // Envoyer une notification de mission
    async notifyMissionCreated(mission) {
        try {
            const notificationTitle = 'Nouvelle Mission Disponible!';
            const notificationBody = `Une nouvelle mission "${mission.titre}" a été créée pour vous.`;

            const result = await this.showNotification(
                notificationTitle,
                notificationBody,
                {
                    type: 'success',
                    duration: 10000,
                    onClick: () => {
                        // Rediriger vers la page des missions
                        window.location.href = '/missions';
                    }
                }
            );

            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Envoyer une notification de rencontre
    async notifyMeetingScheduled(meeting) {
        try {
            const notificationTitle = 'Rencontre Programmée!';
            const notificationBody = `Vous avez une rencontre programmée à ${meeting.lieu} à ${meeting.heure}.`;

            const result = await this.showNotification(
                notificationTitle,
                notificationBody,
                {
                    type: 'info',
                    duration: 10000,
                    onClick: () => {
                        // Rediriger vers la page des rencontres
                        window.location.href = '/meetings';
                    }
                }
            );

            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Vérifier l'état des permissions
    async checkPermissionStatus() {
        try {
            if (!this.isSupported) {
                return { supported: false, status: 'unsupported' };
            }

            const status = Notification.permission;
            this.permission = status;

            return {
                supported: true,
                status: status,
                granted: status === 'granted'
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Template de notification pour les différents types
    getNotificationTemplate(type, data) {
        const templates = {
            mission_created: {
                title: 'Nouvelle Mission!',
                message: `Une mission "${data.title}" a été créée pour vous.`,
                icon: '/icons/mission.png'
            },
            meeting_scheduled: {
                title: 'Rencontre Programmée!',
                message: `Vous avez une rencontre à ${data.location} à ${data.time}.`,
                icon: '/icons/meeting.png'
            },
            object_shared: {
                title: 'Objet Partagé!',
                message: `Un nouvel objet a été partagé pour votre mission.`,
                icon: '/icons/object.png'
            }
        };

        return templates[type] || templates.mission_created;
    }
}
