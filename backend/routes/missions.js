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

        // Créer une mission temporaire avec un identifiant de mission
        const temporaryMission = {
            titre: 'Mission en cours de génération...',
            description: 'En attente de génération par l\'agent IA',
            difficulte: 'En cours',
            objectifs: 'Génération en cours',
            indices: 'En attente'
        }

        // Insérer la mission temporaire
        const result = await db.run(
            'INSERT INTO missions (titre, description, difficulte, objectifs, indices) VALUES (?, ?, ?, ?, ?)',
            [temporaryMission.titre, temporaryMission.description, temporaryMission.difficulte, temporaryMission.objectifs, temporaryMission.indices]
        )

        // Récupérer l'ID de la mission créée
        const missionId = result.lastID

        // Retourner l'ID de la mission pour que le frontend puisse suivre sa génération
        res.status(201).json({
            missionId: missionId,
            message: 'Mission créée, génération en cours via l\'agent n8n'
        })
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
