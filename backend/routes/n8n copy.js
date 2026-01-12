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
 * Endpoint pour générer une mission via l'agent n8n
 * @route POST /api/n8n/generate-mission
 * @group N8N - Gestion des agents IA
 * @param {object} req.body - Données pour la génération de mission
 * @param {number} req.body.userId - ID de l'utilisateur
 * @param {object} req.body.location - Localisation de l'utilisateur
 * @param {object} req.body.preferences - Préférences de l'utilisateur
 * @returns {object} 200 - Mission générée
 * @returns {object} 400 - Données invalides
 * @returns {object} 500 - Erreur serveur
 */
router.post('/generate-mission', async (req, res) => {
    try {
        const { userId, location, preferences } = req.body

        // Validation des données requises
        if (!userId || !location) {
            return res.status(400).json({
                error: 'Données incomplètes : userId et location sont requis'
            })
        }

        const db = await getDB()

        // Récupérer les informations de l'utilisateur
        const user = await db.get(
            'SELECT id, pseudo, prenom, nom, email, preferencesRencontre FROM users WHERE id = ?',
            [userId]
        )

        if (!user) {
            return res.status(404).json({
                error: 'Utilisateur non trouvé'
            })
        }

        // Appel à l'agent n8n pour générer la mission
        // Utilisation de l'URL du webhook n8n configuré
        const n8nWebhookUrl = 'http://localhost:5678/webhook-test/cdac2c18-00f0-4020-b316-a695181d9b3f'

        // Données à envoyer à n8n
        const n8nPayload = {
            user: {
                id: user.id,
                pseudo: user.pseudo,
                prenom: user.prenom,
                nom: user.nom,
                email: user.email,
                preferencesRencontre: user.preferencesRencontre
            },
            chatInput: `Génère une mission personnalisée pour l'utilisateur ${user.prenom} ${user.nom}. 
            Les préférences de rencontre sont: ${JSON.stringify(preferences || user.preferencesRencontre || {})}.
            La localisation est: ${JSON.stringify(location || {})}.
            Crée une mission captivante dans le style de l'application BSG avec un titre, une description, un niveau de difficulté, des objectifs et des indices.`
        }

        // Effectuer l'appel HTTP vers le webhook n8n
        console.log('Appel à n8n avec les données:', n8nPayload);
        try {
            const n8nResponse = await fetch(n8nWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(n8nPayload)
            })

            console.log('Réponse n8n:', n8nResponse.status, n8nResponse.statusText);

            if (!n8nResponse.ok) {
                const errorText = await n8nResponse.text();
                console.error('Erreur n8n:', errorText);
                throw new Error(`Erreur HTTP de n8n: ${n8nResponse.status} - ${n8nResponse.statusText} - ${errorText}`)
            }

            const n8nData = await n8nResponse.json()
            console.log('Données reçues de n8n:', n8nData);

            // Retourner les résultats de n8n au frontend
            res.json({
                success: true,
                message: 'Mission générée via l\'agent n8n',
                n8nResult: n8nData,
                userId: userId,
                location: location,
                preferences: preferences
            })
        } catch (fetchError) {
            console.error('Erreur lors de l\'appel à n8n:', fetchError);
            // Même en cas d'erreur, on continue et on retourne une réponse de base
            // pour éviter que le frontend ne bloque
            res.json({
                success: true,
                message: 'Mission créée, appel à n8n impossible (simulation)',
                n8nResult: {
                    titre: 'Mission de test - Générée par l\'agent n8n',
                    description: 'Mission créée automatiquement par l\'agent IA selon vos préférences.',
                    difficulte: 'Moyen',
                    objectifs: 'Compléter la mission, Trouver l\'indice, Interagir avec le partenaire',
                    indices: 'L\'indice se trouve dans le café de la place Bellecour'
                },
                userId: userId,
                location: location,
                preferences: preferences
            })
        }

    } catch (error) {
        console.error('Erreur dans la génération de mission n8n:', error)
        res.status(500).json({
            error: 'Erreur lors de la génération de la mission',
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
        console.log(req.body)
        // let user, chatInput;

        // // Si c'est un tableau avec un objet contenant "text"
        // if (Array.isArray(data) && data.length > 0 && data[0].hasOwnProperty('text')) {
        //     chatInput = data[0].text;
        //     // Pour l'exemple, on crée un utilisateur de base
        //     user = {
        //         id: "test-user-123",
        //         pseudo: "UtilisateurTest",
        //         prenom: "Test",
        //         nom: "Utilisateur",
        //         email: "test@example.com"
        //     };
        // } else {
        //     // Sinon, on utilise les champs traditionnels
        //     // Si c'est directement un objet avec text
        //     if (data.hasOwnProperty('text')) {
        //         chatInput = data.text;
        //         user = {
        //             id: "test-user-123",
        //             pseudo: "UtilisateurTest",
        //             prenom: "Test",
        //             nom: "Utilisateur",
        //             email: "test@example.com"
        //         };
        //     } else {
        //         user = data.user;
        //         chatInput = data.chatInput;
        //     }
        // }

        // // Validation des données requises
        // if (!user || !chatInput) {
        //     return res.status(400).json({
        //         error: 'Données incomplètes : user et chatInput sont requis'
        //     })
        // }

        // // Ici, vous pouvez ajouter la logique pour traiter les résultats du webhook
        // // Par exemple, stocker les résultats dans la base de données ou les transmettre au frontend

        // console.log('Résultats reçus du webhook n8n (webhook-result):', { user, chatInput })

        // // Exemple de traitement : stocker dans la base de données missions au lieu de evenements
        // const db = await getDB()

        // // Extraire les données de la mission depuis chatInput (qui devrait contenir le JSON)
        // let missionData;
        // try {
        //     // Si chatInput est une chaîne JSON, on la parse
        //     if (typeof chatInput === 'string') {
        //         // Essayer de parser directement comme JSON
        //         missionData = JSON.parse(chatInput);
        //     } else {
        //         // Sinon, on suppose que c'est déjà un objet
        //         missionData = chatInput;
        //     }
        // } catch (parseError) {
        //     console.error('Erreur de parsing JSON direct:', parseError);
        //     // Si le parsing direct échoue, essayer d'extraire le JSON du texte
        //     try {
        //         // Extraire le JSON du format markdown ```json ... ```
        //         const jsonMatch = chatInput.match(/```json\s*([\s\S]*?)\s*```/);
        //         if (jsonMatch && jsonMatch[1]) {
        //             missionData = JSON.parse(jsonMatch[1]);
        //         } else {
        //             // Si on ne trouve pas de JSON formaté, on extrait les parties importantes
        //             const titreMatch = chatInput.match(/Titre\s*:\s*\*\*"(.*?)"\*\*/);
        //             const descriptionMatch = chatInput.match(/Description\s*:\s*"([^"]*)"/);
        //             const difficulteMatch = chatInput.match(/Niveau de difficulté\s*:\s*\*\*(.*?)\*\*/);
        //             const objectifsMatch = chatInput.match(/Objectifs\s*:\s*(.*?)(?:\n\n|\n$)/s);
        //             const indicesMatch = chatInput.match(/Indices\s*:\s*(.*?)(?:\n\n|\n$)/s);

        //             missionData = {
        //                 titre: titreMatch ? titreMatch[1] : 'Mission générée via IA',
        //                 description: descriptionMatch ? descriptionMatch[1] : chatInput,
        //                 difficulte: difficulteMatch ? difficulteMatch[1] : 'Moyen',
        //                 objectifs: objectifsMatch ? objectifsMatch[1].split('* ').filter(o => o.trim()).join(', ') : 'Objectif 1, Objectif 2, Objectif 3',
        //                 indices: indicesMatch ? indicesMatch[1].split('* ').filter(i => i.trim()).join('. ') : 'Indice 1'
        //             };
        //         }
        //     } catch (extractError) {
        //         console.error('Erreur d\'extraction des données:', extractError);
        //         // Si tout échoue, on utilise les données brutes
        //         missionData = {
        //             titre: 'Mission générée via IA',
        //             description: chatInput,
        //             difficulte: 'Moyen',
        //             objectifs: 'Objectif 1, Objectif 2, Objectif 3',
        //             indices: 'Indice 1'
        //         };
        //     }
        // }

        // // Insérer la mission dans la table missions
        // await db.run(
        //     'INSERT INTO missions (titre, description, difficulte, objectifs, indices) VALUES (?, ?, ?, ?, ?)',
        //     [missionData.titre, missionData.description, missionData.difficulte, missionData.objectifs, missionData.indices]
        // )

        // // Retourner une réponse de succès
        // res.json({
        //     success: true,
        //     message: 'Mission créée avec succès à partir des résultats du webhook',
        //     user: user.id
        // })

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
