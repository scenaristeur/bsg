import express from 'express'
const router = express.Router()

// Importer la base de données
import { getDB } from '../db.js'

// Récupérer toutes les rencontres d'un utilisateur
router.get('/user/:userId', async (req, res) => {
    try {
        const db = await getDB()
        const rencontres = await db.all('SELECT * FROM rencontres WHERE userId = ? ORDER BY createdAt DESC', [req.params.userId])
        res.json(rencontres)
    } catch (error) {
        console.error('Erreur lors de la récupération des rencontres:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Récupérer une rencontre spécifique
router.get('/:id', async (req, res) => {
    try {
        const db = await getDB()
        const rencontre = await db.get('SELECT * FROM rencontres WHERE id = ?', [req.params.id])

        if (!rencontre) {
            return res.status(404).json({ error: 'Rencontre non trouvée' })
        }

        res.json(rencontre)
    } catch (error) {
        console.error('Erreur lors de la récupération de la rencontre:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Créer une nouvelle rencontre
router.post('/', async (req, res) => {
    try {
        const { userId, type, lieu, transport, arret, heure, statut } = req.body
        const db = await getDB()

        const result = await db.run(
            'INSERT INTO rencontres (userId, type, lieu, transport, arret, heure, statut) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, type, lieu, transport, arret, heure, statut || 'programmee']
        )

        const rencontre = await db.get('SELECT * FROM rencontres WHERE id = ?', [result.lastID])
        res.status(201).json(rencontre)
    } catch (error) {
        console.error('Erreur lors de la création de la rencontre:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Mettre à jour une rencontre
router.put('/:id', async (req, res) => {
    try {
        const { userId, type, lieu, transport, arret, heure, statut } = req.body
        const db = await getDB()

        const result = await db.run(
            'UPDATE rencontres SET userId = ?, type = ?, lieu = ?, transport = ?, arret = ?, heure = ?, statut = ? WHERE id = ?',
            [userId, type, lieu, transport, arret, heure, statut, req.params.id]
        )

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Rencontre non trouvée' })
        }

        const rencontre = await db.get('SELECT * FROM rencontres WHERE id = ?', [req.params.id])
        res.json(rencontre)
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la rencontre:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Supprimer une rencontre
router.delete('/:id', async (req, res) => {
    try {
        const db = await getDB()
        const result = await db.run('DELETE FROM rencontres WHERE id = ?', [req.params.id])

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Rencontre non trouvée' })
        }

        res.json({ message: 'Rencontre supprimée avec succès' })
    } catch (error) {
        console.error('Erreur lors de la suppression de la rencontre:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Marquer une rencontre comme terminée
router.put('/:id/terminer', async (req, res) => {
    try {
        const db = await getDB()
        const result = await db.run('UPDATE rencontres SET statut = ? WHERE id = ?', ['terminee', req.params.id])

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Rencontre non trouvée' })
        }

        res.json({ message: 'Rencontre marquée comme terminée' })
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la rencontre:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

export default router
