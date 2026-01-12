import express from 'express'
import { getDB, initDB } from './db.js'
import bodyParser from 'body-parser'
import cors from "cors";
import path from 'path'
import bcrypt from 'bcrypt'
import http from 'http'
import { Server } from 'socket.io'

// import dotenv from "dotenv"
// dotenv.config()

const PORT = process.env.PORT || 3000
const SALT_ROUNDS = 10

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5678'],
        methods: ['GET', 'POST']
    }
})

app.use(bodyParser.json())
app.use(express.static("public"))
app.use(cors({
    'origin': ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5678'],
    'allowedHeaders': ['sessionId', 'Content-Type', 'Authorization', 'authorization'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'credentials': true,
    'preflightContinue': false
}));

// Initialisation de la base de données
initDB()

// Importer les nouveaux routeurs
import usersRouter from './routes/users.js'
import missionsRouter from './routes/missions.js'
import rencontresRouter from './routes/rencontres.js'
import interactionsRouter from './routes/interactions.js'
import evenementsRouter from './routes/evenements.js'
import N8nRouter from './routes/n8n.js'

// Passer io au routeur n8n
N8nRouter.setIo(io)

// Utilisation des routeurs
app.use('/api/users', usersRouter)
app.use('/api/missions', missionsRouter)
app.use('/api/rencontres', rencontresRouter)
app.use('/api/interactions', interactionsRouter)
app.use('/api/evenements', evenementsRouter)
app.use('/api/n8n', n8nRouterWithIo)

// Route de test pour vérifier que le serveur fonctionne
app.get('/test', (req, res) => {
    res.json({ message: 'Serveur backend fonctionnel' })
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

// Gestion des connexions WebSocket
io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté:', socket.id)

    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté:', socket.id)
    })
})

// Démarrage du serveur
server.listen(PORT, () => {
    console.log(`backend running on ${PORT}`)
})

// Exporter io pour pouvoir l'utiliser dans d'autres modules
export { io }
