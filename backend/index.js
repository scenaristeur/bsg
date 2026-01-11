import express from 'express'
import { getDB, initDB } from './db.js'
import bodyParser from 'body-parser'
import cors from "cors";
// import dotenv from "dotenv"
// dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()
app.use(bodyParser.json())
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
    res.send("serveur backend BSG")
})

app.get("/users", (req, res) => {
    let users = [
        { id: 1 },
        { id: 2 }
    ]
    res.json(
        users
    )
})

app.post("/users", async (req, res) => {
    // console.log(req)
    const body = req.body
    console.log(body)
    // const name = body.name
    // if (!name || typeof name !== "string") {
    //     res.statusCode = 400
    //     res.json({ error: "Invalid name" })
    //     return
    // }

    // const db = getDB()
    // let id = await db.run(`
    //     INSERT INTO users (name)
    //     VALUES (?)
    //     `, [name])
    // console.log("id", id)
    // const user = await db.get(
    //     "SELECT * FROM users WHERE id = (SELECT last_insert_rowid())"
    // )

    // res.json(user)
    res.json(body)
})


app.get("/about", (req, res) => {
    res.type("html")
    res.send("<h1>Bonjour</h1>")
})

app.listen(PORT, () => {
    console.log(`backend running on ${PORT}`)
})