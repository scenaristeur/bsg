import express from 'express'
const router = express.Router()

// Importer la base de données
import { getDB } from '../db.js'

// Récupérer toutes les interactions d'un utilisateur
router.get('/user/:userId', async (req, res) => {
    try {
        const db = await getDB()
        const interactions = await db.all('SELECT * FROM interactions WHERE userId1 = ? OR userId2 = ? ORDER BY createdAt DESC', [req.params.userId, req.params.userId])
        res.json(interactions)
    } catch (error) {
        console.error('Erreur lors de la récupération des interactions:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Récupérer les interactions entre deux utilisateurs
router.get('/between/:userId1/:userId2', async (req, res) => {
    try {
        const db = await getDB()
        const interactions = await db.all(
            'SELECT * FROM interactions WHERE (userId1 = ? AND userId2 = ?) OR (userId1 = ? AND userId2 = ?) ORDER BY createdAt DESC',
            [req.params.userId1, req.params.userId2, req.params.userId2, req.params.userId1]
        )
        res.json(interactions)
    } catch (error) {
        console.error('Erreur lors de la récupération des interactions:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Récupérer une interaction spécifique
router.get('/:id', async (req, res) => {
    try {
        const db = await getDB()
        const interaction = await db.get('SELECT * FROM interactions WHERE id = ?', [req.params.id])

        if (!interaction) {
            return res.status(404).json({ error: 'Interaction non trouvée' })
        }

        res.json(interaction)
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'interaction:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Créer une nouvelle interaction
router.post('/', async (req, res) => {
    try {
        const { userId1, userId2, missionId, type, contenu } = req.body
        const db = await getDB()

        const result = await db.run(
            'INSERT INTO interactions (userId1, userId2, missionId, type, contenu) VALUES (?, ?, ?, ?, ?)',
            [userId1, userId2, missionId, type, contenu]
        )

        const interaction = await db.get('SELECT * FROM interactions WHERE id = ?', [result.lastID])
        res.status(201).json(interaction)
    } catch (error) {
        console.error('Erreur lors de la création de l\'interaction:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Mettre à jour une interaction
router.put('/:id', async (req, res) => {
    try {
        const { userId1, userId2, missionId, type, contenu } = req.body
        const db = await getDB()

        const result = await db.run(
            'UPDATE interactions SET userId1 = ?, userId2 = ?, missionId = ?, type = ?, contenu = ? WHERE id = ?',
            [userId1, userId2, missionId, type, contenu, req.params.id]
        )

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Interaction non trouvée' })
        }

        const interaction = await db.get('SELECT * FROM interactions WHERE id = ?', [req.params.id])
        res.json(interaction)
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'interaction:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Supprimer une interaction
router.delete('/:id', async (req, res) => {
    try {
        const db = await getDB()
        const result = await db.run('DELETE FROM interactions WHERE id = ?', [req.params.id])

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Interaction non trouvée' })
        }

        res.json({ message: 'Interaction supprimée avec succès' })
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'interaction:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

export default router
