import express from 'express'
import { getDB, initDB } from './db.js'
import bodyParser from 'body-parser'
import cors from "cors";
import path from 'path'
// import dotenv from "dotenv"
// dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()
app.use(bodyParser.json())
app.use(express.static("public"))
initDB()

// app.use(cors({
//     'origin': '*'
//     // 'allowedHeaders': ['sessionId', 'Content-Type', 'Authorization', 'authorization'],
//     // 'exposedHeaders': ['sessionId'],
//     // 'origin': ['https://eccentrictoad.com', 'https://www.eccentrictoad.com'],
//     // 'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     // 'credentials': false,
//     // 'preflightContinue': false
// }));

app.get("/", (req, res) => {
    // res.send("serveur backend BSG")
    res.sendFile(path.join(process.cwd(), "/views/index.html"))

})

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

    console.log("email", email)
    const db = await getDB()

    await db.run(
        `INSERT INTO users (nom, prenom, pseudo, email, password) VALUES ('${nom}', '${prenom}', '${pseudo}', '${email}', '${password}')`)
    const user = await db.get(
        "SELECT * FROM users WHERE id = (SELECT last_insert_rowid())"
    )
    res.statusCode = 201
    res.json({ message: "Utilisateur créé", user: user })
})


app.get("/about", (req, res) => {
    res.type("html")
    res.send("<h1>Bonjour</h1>")
})

app.listen(PORT, () => {
    console.log(`backend running on ${PORT}`)
})
