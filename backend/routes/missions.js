import express from 'express'
const router = express.Router()

// Importer la base de données
import { getDB } from '../db.js'

// Récupérer toutes les missions
router.get('/', async (req, res) => {
    try {
        const db = await getDB()
        const missions = await db.all('SELECT * FROM missions ORDER BY createdAt DESC')
        res.json(missions)
    } catch (error) {
        console.error('Erreur lors de la récupération des missions:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Récupérer les missions d'un utilisateur spécifique
router.get('/user/:userId', async (req, res) => {
    try {
        const db = await getDB()
        const missions = await db.all(`
            SELECT m.*, ma.role, ma.statut 
            FROM missions m 
            JOIN missions_assignees ma ON m.id = ma.mission_id 
            WHERE ma.user_id = ? 
            ORDER BY m.createdAt DESC
        `, [req.params.userId])
        res.json(missions)
    } catch (error) {
        console.error('Erreur lors de la récupération des missions de l\'utilisateur:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Récupérer une mission spécifique
router.get('/:id', async (req, res) => {
    try {
        const db = await getDB()
        const mission = await db.get('SELECT * FROM missions WHERE id = ?', [req.params.id])

        if (!mission) {
            return res.status(404).json({ error: 'Mission non trouvée' })
        }

        res.json(mission)
    } catch (error) {
        console.error('Erreur lors de la récupération de la mission:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Créer une nouvelle mission
router.post('/', async (req, res) => {
    try {
        const { titre, description, difficulte, objectifs, indices } = req.body
        const db = await getDB()

        const result = await db.run(
            'INSERT INTO missions (titre, description, difficulte, objectifs, indices) VALUES (?, ?, ?, ?, ?)',
            [titre, description, difficulte, objectifs, indices]
        )

        const mission = await db.get('SELECT * FROM missions WHERE id = ?', [result.lastID])
        res.status(201).json(mission)
    } catch (error) {
        console.error('Erreur lors de la création de la mission:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Générer une nouvelle mission via l'agent n8n
router.post('/generate', async (req, res) => {
    try {
        const { userId, location, preferences } = req.body
        const db = await getDB()

        // Vérifier que l'utilisateur existe
        const user = await db.get('SELECT * FROM users WHERE id = ?', [userId])
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' })
        }

        // Appel à l'agent n8n pour générer la mission
        // Utilisation de l'endpoint n8n générique
        // const n8nWebhookUrl = 'http://localhost:5678/webhook/cdac2c18-00f0-4020-b316-a695181d9b3f'
        const n8nWebhookUrl = 'https://endamoebic-ardell-tonetically.ngrok-free.dev/webhook/6f459dce-8955-44e6-b567-ba26692d8db4'

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

            // Retourner l'ID de la mission pour que le frontend puisse suivre sa génération
            // La mission sera créée via le webhook-result
            res.status(201).json({
                message: 'Mission en cours de création via l\'agent n8n',
                n8nResult: n8nData
            })
        } catch (fetchError) {
            console.error('Erreur lors de l\'appel à n8n:', fetchError);
            // En cas d'erreur, on retourne une erreur
            res.status(500).json({
                error: 'Erreur lors de l\'appel à n8n',
                message: fetchError.message
            })
        }

    } catch (error) {
        console.error('Erreur lors de la génération de la mission:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Mettre à jour une mission
router.put('/:id', async (req, res) => {
    try {
        const { titre, description, difficulte, objectifs, indices } = req.body
        const db = await getDB()

        const result = await db.run(
            'UPDATE missions SET titre = ?, description = ?, difficulte = ?, objectifs = ?, indices = ? WHERE id = ?',
            [titre, description, difficulte, objectifs, indices, req.params.id]
        )

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Mission non trouvée' })
        }

        const mission = await db.get('SELECT * FROM missions WHERE id = ?', [req.params.id])
        res.json(mission)
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la mission:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Supprimer une mission
router.delete('/:id', async (req, res) => {
    try {
        const db = await getDB()
        const result = await db.run('DELETE FROM missions WHERE id = ?', [req.params.id])

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Mission non trouvée' })
        }

        res.json({ message: 'Mission supprimée avec succès' })
    } catch (error) {
        console.error('Erreur lors de la suppression de la mission:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

export default router
