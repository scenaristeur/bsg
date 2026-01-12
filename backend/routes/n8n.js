import express from 'express'
import { getDB } from '../db.js'
import { compare } from 'bcrypt'

const router = express.Router()

/**
 * Endpoint pour recevoir les événements du webhook n8n
 * @route POST /api/n8n/webhook
 * @group N8N - Gestion des agents IA
 * @param {object} req.body - Données du webhook
 * @param {string} req.body.user_id - ID de l'utilisateur
 * @param {object} req.body.location - Localisation de l'utilisateur
 * @param {string} req.body.timestamp - Timestamp de l'événement
 * @param {object} req.body.preferences - Préférences de l'utilisateur
 * @returns {object} 200 - Notification générée
 * @returns {object} 400 - Données invalides
 * @returns {object} 500 - Erreur serveur
 */
router.post('/webhook', async (req, res) => {
    try {
        const { user_id, location, timestamp, preferences } = req.body

        // Validation des données requises
        if (!user_id || !location || !timestamp) {
            return res.status(400).json({
                error: 'Données incomplètes : user_id, location et timestamp sont requis'
            })
        }

        const db = await getDB()

        // Récupérer les informations de l'utilisateur
        const user = await db.get(
            'SELECT id, pseudo, prenom, nom, email, preferencesRencontre FROM users WHERE id = ?',
            [user_id]
        )

        if (!user) {
            return res.status(404).json({
                error: 'Utilisateur non trouvé'
            })
        }

        // Simuler la génération d'une notification via un agent IA
        // Dans une implémentation réelle, cela viendrait de l'IA
        const notification = generateMeetingNotification(user, location, preferences)

        // Stocker la notification dans la base de données (optionnel)
        await db.run(
            'INSERT INTO evenements (type, message, utilisateur_id, details, created_at) VALUES (?, ?, ?, ?, ?)',
            ['meeting', notification.message, user_id, JSON.stringify(notification.details), new Date().toISOString()]
        )

        // Retourner la notification générée
        res.json({
            success: true,
            notification: notification,
            user: {
                id: user.id,
                pseudo: user.pseudo,
                prenom: user.prenom,
                nom: user.nom
            }
        })

    } catch (error) {
        console.error('Erreur dans le webhook n8n:', error)
        res.status(500).json({
            error: 'Erreur lors du traitement du webhook',
            message: error.message
        })
    }
})

/**
 * Endpoint pour recevoir les résultats du webhook n8n (ajouté)
 * @route POST /api/n8n/webhook-result
 * @group N8N - Gestion des agents IA
 * @param {object} req.body - Données du webhook
 * @param {object} req.body.user - Informations utilisateur
 * @param {string} req.body.chatInput - Prompt pour l'IA
 * @returns {object} 200 - Traitement réussi
 * @returns {object} 500 - Erreur serveur
 */
router.post('/webhook-result', async (req, res) => {
    try {
        // Le workflow n8n envoie les données sous forme de tableau avec un objet contenant "text"
        const data = req.body;
        let user, chatInput;

        // Si c'est un tableau avec un objet contenant "text"
        if (Array.isArray(data) && data.length > 0 && data[0].hasOwnProperty('text')) {
            chatInput = data[0].text;
            // Pour l'exemple, on crée un utilisateur de base
            user = {
                id: "test-user-123",
                pseudo: "UtilisateurTest",
                prenom: "Test",
                nom: "Utilisateur",
                email: "test@example.com"
            };
        } else {
            // Sinon, on utilise les champs traditionnels
            // Si c'est directement un objet avec text
            if (data.hasOwnProperty('text')) {
                chatInput = data.text;
                user = {
                    id: "test-user-123",
                    pseudo: "UtilisateurTest",
                    prenom: "Test",
                    nom: "Utilisateur",
                    email: "test@example.com"
                };
            } else {
                user = data.user;
                chatInput = data.chatInput;
            }
        }

        // Validation des données requises
        if (!user || !chatInput) {
            return res.status(400).json({
                error: 'Données incomplètes : user et chatInput sont requis'
            })
        }

        // Ici, vous pouvez ajouter la logique pour traiter les résultats du webhook
        // Par exemple, stocker les résultats dans la base de données ou les transmettre au frontend

        console.log('Résultats reçus du webhook n8n (webhook-result):', { user, chatInput })

        // Exemple de traitement : stocker dans la base de données
        const db = await getDB()
        await db.run(
            'INSERT INTO evenements (nom, type, description, lieu, utilisateur_id, details, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
            ['webhook_result', 'webhook_result', chatInput, 'Inconnu', user.id, JSON.stringify({ user, chatInput }), new Date().toISOString()]
        )

        // Retourner une réponse de succès
        res.json({
            success: true,
            message: 'Résultats du webhook traités avec succès',
            user: user.id
        })

    } catch (error) {
        console.error('Erreur dans le webhook-result n8n:', error)
        res.status(500).json({
            error: 'Erreur lors du traitement des résultats du webhook',
            message: error.message
        })
    }
})

/**
 * Génère une notification de rencontre basée sur les préférences de l'utilisateur
 * @param {object} user - Informations de l'utilisateur
 * @param {object} location - Localisation
 * @param {object} preferences - Préférences de l'utilisateur
 * @returns {object} Notification générée
 */
function generateMeetingNotification(user, location, preferences) {
    // Exemple de logique IA pour générer une notification personnalisée
    const meetingTypes = {
        transport: {
            message: "Prenez le bus 34 pour rejoindre votre domicile à Perrache. Direction le fond du bus.",
            details: {
                time: "18:30",
                location: "Quartier de la Croix-Rousse",
                transport: "Bus 34",
                stop: "Lycée Lumière",
                instructions: [
                    "Direction le fond du bus",
                    "Rechercher un partenaire avec une écharpe bleue",
                    "Utiliser le mot de passe: \"étagère\""
                ]
            }
        },
        lieu: {
            message: "Un partenaire vous attend à l'arrêt Moulin à vent. Il portera une écharpe bleue.",
            details: {
                time: "18:30",
                location: "Arrêt Moulin à vent",
                transport: "Bus 34",
                stop: "Moulin à vent",
                instructions: [
                    "Rechercher un partenaire avec une écharpe bleue",
                    "Utiliser le mot de passe: \"étagère\"",
                    "Dire la phrase: \"périscope\""
                ]
            }
        },
        restaurant: {
            message: "Un partenaire vous attend dans le restaurant à la place Bellecour.",
            details: {
                time: "19:00",
                location: "Place Bellecour",
                transport: "Marche",
                stop: "Restaurant",
                instructions: [
                    "Rechercher un partenaire avec une écharpe bleue",
                    "Utiliser le mot de passe: \"étagère\"",
                    "Dire la phrase: \"périscope\""
                ]
            }
        }
    }

    // Sélectionner le type de rencontre basé sur les préférences ou par défaut
    const meetingType = preferences?.meeting_type || 'transport'
    const notificationTemplate = meetingTypes[meetingType] || meetingTypes.transport

    return {
        type: 'meeting',
        message: notificationTemplate.message,
        user: user.pseudo || `${user.prenom} ${user.nom}`,
        details: notificationTemplate.details,
        timestamp: new Date().toISOString()
    }
}

export default router
