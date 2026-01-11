import express from 'express'
import { getDB, initDB } from './db.js'
import bodyParser from 'body-parser'
import cors from "cors";
import path from 'path'
import bcrypt from 'bcrypt'
// import dotenv from "dotenv"
// dotenv.config()

const PORT = process.env.PORT || 3000
const SALT_ROUNDS = 10

const app = express()
app.use(bodyParser.json())
app.use(express.static("public"))
app.use(cors({
    'origin': ['http://localhost:5173', 'http://localhost:3000'],
    'allowedHeaders': ['sessionId', 'Content-Type', 'Authorization', 'authorization'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'credentials': true,
    'preflightContinue': false
}));
initDB()

// Importer les nouveaux routeurs
import usersRouter from './routes/users.js'
import missionsRouter from './routes/missions.js'
import rencontresRouter from './routes/rencontres.js'
import interactionsRouter from './routes/interactions.js'
import evenementsRouter from './routes/evenements.js'

// Utilisation des routeurs
app.use('/api/users', usersRouter)
app.use('/api/missions', missionsRouter)
app.use('/api/rencontres', rencontresRouter)
app.use('/api/interactions', interactionsRouter)
app.use('/api/evenements', evenementsRouter)

// Routes supplémentaires (anciennes routes qui ne sont plus dans les routeurs)
app.get("/users", async (req, res) => {
    const db = await getDB()
    const users = await db.all(
        "SELECT * FROM users"
    )
    return res.json(users)
})

app.delete("/users", async (req, res) => {
    const body = req.body
    const db = await getDB()
    console.log("delete", body)
    const id = body.id
    const sql = 'DELETE FROM users WHERE id = ?'
    let result = await db.run(sql, (id))
    console.log("result", result)
    res.json({ message: "Utilisateur effacé", id: id })

})

app.post("/users", async (req, res) => {
    const body = req.body

    // Vérification de la présence du corps de la requête
    if (!body) {
        return res.status(400).json({ error: "Aucune donnée reçue" })
    }

    // Vérification de la présence du nom
    const nom = body.nom
    const prenom = body.prenom
    const pseudo = body.pseudo
    const email = body.email
    const password = body.password
    if (!nom || typeof nom !== "string") {
        return res.status(400).json({ error: "Nom invalide" })
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    console.log("email", email)
    const db = await getDB()

    await db.run(
        `INSERT INTO users (nom, prenom, pseudo, email, password) VALUES ('${nom}', '${prenom}', '${pseudo}', '${email}', '${hashedPassword}')`)
    const user = await db.get(
        "SELECT * FROM users WHERE id = (SELECT last_insert_rowid())"
    )
    res.statusCode = 201
    res.json({ message: "Utilisateur créé", user: user })
})

// Route de connexion
app.post("/login", async (req, res) => {
    const { email, password } = req.body

    // Vérification des données d'entrée
    if (!email || !password) {
        return res.status(400).json({ error: "Email et mot de passe requis" })
    }

    try {
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

app.get("/", (req, res) => {
    // res.send("serveur backend BSG")
    res.sendFile(path.join(process.cwd(), "/views/index.html"))

})

app.get("/about", (req, res) => {
    res.type("html")
    res.send("<h1>Bonjour</h1>")
})

app.listen(PORT, () => {
    console.log(`backend running on ${PORT}`)
})
