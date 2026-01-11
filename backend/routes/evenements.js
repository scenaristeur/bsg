import express from 'express'
const router = express.Router()

// Importer la base de données
import { getDB } from '../db.js'

// Récupérer tous les événements
router.get('/', async (req, res) => {
    try {
        const db = await getDB()
        const evenements = await db.all('SELECT * FROM evenements ORDER BY createdAt DESC')
        res.json(evenements)
    } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Récupérer un événement spécifique
router.get('/:id', async (req, res) => {
    try {
        const db = await getDB()
        const evenement = await db.get('SELECT * FROM evenements WHERE id = ?', [req.params.id])

        if (!evenement) {
            return res.status(404).json({ error: 'Événement non trouvé' })
        }

        res.json(evenement)
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'événement:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Créer un nouvel événement
router.post('/', async (req, res) => {
    try {
        const { nom, description, lieu, latitude, longitude, type } = req.body
        const db = await getDB()

        const result = await db.run(
            'INSERT INTO evenements (nom, description, lieu, latitude, longitude, type) VALUES (?, ?, ?, ?, ?, ?)',
            [nom, description, lieu, latitude, longitude, type]
        )

        const evenement = await db.get('SELECT * FROM evenements WHERE id = ?', [result.lastID])
        res.status(201).json(evenement)
    } catch (error) {
        console.error('Erreur lors de la création de l\'événement:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Mettre à jour un événement
router.put('/:id', async (req, res) => {
    try {
        const { nom, description, lieu, latitude, longitude, type } = req.body
        const db = await getDB()

        const result = await db.run(
            'UPDATE evenements SET nom = ?, description = ?, lieu = ?, latitude = ?, longitude = ?, type = ? WHERE id = ?',
            [nom, description, lieu, latitude, longitude, type, req.params.id]
        )

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Événement non trouvé' })
        }

        const evenement = await db.get('SELECT * FROM evenements WHERE id = ?', [req.params.id])
        res.json(evenement)
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'événement:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Supprimer un événement
router.delete('/:id', async (req, res) => {
    try {
        const db = await getDB()
        const result = await db.run('DELETE FROM evenements WHERE id = ?', [req.params.id])

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Événement non trouvé' })
        }

        res.json({ message: 'Événement supprimé avec succès' })
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'événement:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Récupérer les événements par type
router.get('/type/:type', async (req, res) => {
    try {
        const db = await getDB()
        const evenements = await db.all('SELECT * FROM evenements WHERE type = ? ORDER BY createdAt DESC', [req.params.type])
        res.json(evenements)
    } catch (error) {
        console.error('Erreur lors de la récupération des événements par type:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Récupérer les événements proches d'une position
router.get('/proximity', async (req, res) => {
    try {
        const { lat, lng, distance = 1000 } = req.query // distance en mètres
        const db = await getDB()

        const evenements = await db.all(`
      SELECT *, 
      (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance
      FROM evenements 
      HAVING distance < ?
      ORDER BY distance
    `, [lat, lng, lat, distance])

        res.json(evenements)
    } catch (error) {
        console.error('Erreur lors de la récupération des événements proches:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

export default router
