import { open } from "sqlite"
import sqlite3 from "sqlite3"
import bcrypt from 'bcrypt'

let dbInstance = null
const SALT_ROUNDS = 10

export async function initDB() {
    dbInstance = await open({
        filename: "db/database.sqlite",
        driver: sqlite3.Database
    })

    dbInstance.on('trace', (data) => {
        console.log(data)
    })

    // La colonne password est de type TEXT pour stocker les hachages bcrypt (60 caractères)
    await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS users (
    id          INTEGER     PRIMARY KEY AUTOINCREMENT,
    nom         TEXT        NOT NULL,
    prenom      TEXT        NOT NULL,
    pseudo      TEXT        NOT NULL,
    email       TEXT        NOT NULL,
    password    TEXT        NOT NULL,
    createdAt   DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP
    )    
    `)

    // Insertion des utilisateurs fictifs s'ils n'existent pas déjà
    await insertDefaultUsers()
}

async function insertDefaultUsers() {
    try {
        const users = [
            {
                nom: "Utilisateur",
                prenom: "Un",
                pseudo: "user1",
                email: "user1@bsg.fr",
                password: "bsg"
            },
            {
                nom: "Utilisateur",
                prenom: "Deux",
                pseudo: "user2",
                email: "user2@bsg.fr",
                password: "bsg"
            },
            {
                nom: "Utilisateur",
                prenom: "Trois",
                pseudo: "user3",
                email: "user3@bsg.fr",
                password: "bsg"
            }
        ]

        for (const user of users) {
            // Vérifier si l'utilisateur existe déjà
            const existingUser = await dbInstance.get(
                "SELECT * FROM users WHERE email = ?",
                [user.email]
            )

            if (!existingUser) {
                // Hachage du mot de passe
                const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS)

                // Insertion de l'utilisateur
                await dbInstance.run(
                    `INSERT INTO users (nom, prenom, pseudo, email, password) VALUES (?, ?, ?, ?, ?)`,
                    [user.nom, user.prenom, user.pseudo, user.email, hashedPassword]
                )
                console.log(`Utilisateur créé : ${user.email}`)
            }
        }
    } catch (error) {
        console.error("Erreur lors de la création des utilisateurs par défaut :", error)
    }
}

export async function getDB() {
    if (!dbInstance) {
        throw new Error("initDB must be called before getDB")
    }
    return dbInstance
}
