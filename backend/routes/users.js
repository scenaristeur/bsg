import express from 'express'
const router = express.Router()

// Importer la base de données
import { getDB } from '../db.js'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

// Récupérer tous les utilisateurs
router.get('/', async (req, res) => {
    try {
        const db = await getDB()
        const users = await db.all('SELECT * FROM users ORDER BY createdAt DESC')
        // Retirer les mots de passe des utilisateurs pour la réponse
        const usersWithoutPasswords = users.map(user => {
            const { password, ...userWithoutPassword } = user
            return userWithoutPassword
        })
        res.json(usersWithoutPasswords)
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Récupérer un utilisateur spécifique
router.get('/:id', async (req, res) => {
    try {
        const db = await getDB()
        const user = await db.get('SELECT * FROM users WHERE id = ?', [req.params.id])

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' })
        }

        // Retirer le mot de passe de la réponse
        const { password, ...userWithoutPassword } = user
        res.json(userWithoutPassword)
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Créer un nouvel utilisateur
router.post('/', async (req, res) => {
    try {
        const { nom, prenom, pseudo, email, password, age, interets, preferencesRencontre, disponibilite } = req.body
        const db = await getDB()

        // Vérification de l'email unique
        const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email])
        if (existingUser) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé' })
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

        const result = await db.run(
            'INSERT INTO users (nom, prenom, pseudo, email, password, age, interets, preferencesRencontre, disponibilite) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [nom, prenom, pseudo, email, hashedPassword, age, interets, preferencesRencontre, disponibilite]
        )

        const user = await db.get('SELECT * FROM users WHERE id = ?', [result.lastID])
        // Retirer le mot de passe de la réponse
        const { password: _, ...userWithoutPassword } = user
        res.status(201).json(userWithoutPassword)
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Mettre à jour un utilisateur
router.put('/:id', async (req, res) => {
    try {
        const { nom, prenom, pseudo, email, password, age, interets, preferencesRencontre, disponibilite } = req.body
        const db = await getDB()

        // Vérification de l'email unique (sauf pour cet utilisateur)
        if (email) {
            const existingUser = await db.get('SELECT * FROM users WHERE email = ? AND id != ?', [email, req.params.id])
            if (existingUser) {
                return res.status(400).json({ error: 'Cet email est déjà utilisé' })
            }
        }

        let hashedPassword = password
        if (password) {
            // Hachage du mot de passe si fourni
            hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
        }

        const result = await db.run(
            'UPDATE users SET nom = ?, prenom = ?, pseudo = ?, email = ?, password = ?, age = ?, interets = ?, preferencesRencontre = ?, disponibilite = ? WHERE id = ?',
            [nom, prenom, pseudo, email, hashedPassword, age, interets, preferencesRencontre, disponibilite, req.params.id]
        )

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' })
        }

        const user = await db.get('SELECT * FROM users WHERE id = ?', [req.params.id])
        // Retirer le mot de passe de la réponse
        const { password: _, ...userWithoutPassword } = user
        res.json(userWithoutPassword)
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Supprimer un utilisateur
router.delete('/:id', async (req, res) => {
    try {
        const db = await getDB()
        const result = await db.run('DELETE FROM users WHERE id = ?', [req.params.id])

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' })
        }

        res.json({ message: 'Utilisateur supprimé avec succès' })
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error)
        res.status(500).json({ error: 'Erreur serveur' })
    }
})

// Route de connexion
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        // Vérification des données d'entrée
        if (!email || !password) {
            return res.status(400).json({ error: "Email et mot de passe requis" })
        }

        const db = await getDB()

        // Récupération de l'utilisateur par email
        const user = await db.get(
            "SELECT * FROM users WHERE email = ?",
            [email]
        )

        // Vérification si l'utilisateur existe
        if (!user) {
            return res.status(401).json({ error: "Identifiants incorrects" })
        }

        // Comparaison du mot de passe fourni avec le hachage stocké
        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
            return res.status(401).json({ error: "Identifiants incorrects" })
        }

        // Si tout est bon, retourner l'utilisateur (sans le mot de passe)
        const { password: _, ...userWithoutPassword } = user
        res.json({
            message: "Connexion réussie",
            user: userWithoutPassword
        })
    } catch (error) {
        console.error("Erreur de connexion:", error)
        res.status(500).json({ error: "Erreur serveur lors de la connexion" })
    }
})

export default router
