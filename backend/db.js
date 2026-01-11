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
    age         INTEGER,
    interets    TEXT,
    preferencesRencontre TEXT,
    disponibilite TEXT,
    createdAt   DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP
    )    
    `)

    // Table pour les missions
    await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS missions (
    id          INTEGER     PRIMARY KEY AUTOINCREMENT,
    titre       TEXT        NOT NULL,
    description TEXT        NOT NULL,
    difficulte  TEXT        NOT NULL,
    objectifs   TEXT,
    indices     TEXT,
    createdAt   DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
    `)

    // Table pour les rencontres
    await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS rencontres (
    id          INTEGER     PRIMARY KEY AUTOINCREMENT,
    userId      INTEGER     NOT NULL,
    type        TEXT        NOT NULL,
    lieu        TEXT        NOT NULL,
    transport   TEXT,
    arret       TEXT,
    heure       TEXT,
    statut      TEXT        NOT NULL DEFAULT 'programmee',
    createdAt   DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
    )
    `)

    // Table pour les interactions
    await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS interactions (
    id          INTEGER     PRIMARY KEY AUTOINCREMENT,
    userId1     INTEGER     NOT NULL,
    userId2     INTEGER     NOT NULL,
    missionId   INTEGER,
    type        TEXT        NOT NULL,
    contenu     TEXT,
    createdAt   DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId1) REFERENCES users(id),
    FOREIGN KEY (userId2) REFERENCES users(id),
    FOREIGN KEY (missionId) REFERENCES missions(id)
    )
    `)

    // Table pour les événements
    await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS evenements (
    id          INTEGER     PRIMARY KEY AUTOINCREMENT,
    nom         TEXT        NOT NULL,
    description TEXT,
    lieu        TEXT        NOT NULL,
    latitude    REAL,
    longitude   REAL,
    type        TEXT        NOT NULL,
    createdAt   DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
    `)

    // Insertion des utilisateurs fictifs s'ils n'existent pas déjà
    await insertDefaultUsers()

    // Insertion des missions fictives s'ils n'existent pas déjà
    await insertDefaultMissions()
}

async function insertDefaultUsers() {
    try {
        const users = [
            {
                nom: "Utilisateur",
                prenom: "Un",
                pseudo: "user1",
                email: "user1@bsg.fr",
                password: "bsg",
                age: 32,
                interets: "Littérature, cinéma, voyages",
                preferencesRencontre: "transport",
                disponibilite: "Soirées, Week-ends"
            },
            {
                nom: "Utilisateur",
                prenom: "Deux",
                pseudo: "user2",
                email: "user2@bsg.fr",
                password: "bsg",
                age: 28,
                interets: "Musique, sport, cuisine",
                preferencesRencontre: "lieu",
                disponibilite: "Week-ends"
            },
            {
                nom: "Utilisateur",
                prenom: "Trois",
                pseudo: "user3",
                email: "user3@bsg.fr",
                password: "bsg",
                age: 35,
                interets: "Photographie, nature, randonnée",
                preferencesRencontre: "restaurant",
                disponibilite: "Soirées"
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
                    `INSERT INTO users (nom, prenom, pseudo, email, password, age, interets, preferencesRencontre, disponibilite) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [user.nom, user.prenom, user.pseudo, user.email, hashedPassword, user.age, user.interets, user.preferencesRencontre, user.disponibilite]
                )
                console.log(`Utilisateur créé : ${user.email}`)
            }
        }
    } catch (error) {
        console.error("Erreur lors de la création des utilisateurs par défaut :", error)
    }
}

async function insertDefaultMissions() {
    try {
        const missions = [
            {
                titre: "Le Mystère du Café",
                description: "Trouvez l'indice caché dans le café de la place Bellecour pour découvrir le prochain lieu de la mission.",
                difficulte: "Facile",
                objectifs: "Identifier le lieu de la mission,Trouver l'indice caché,Résoudre l'énigme",
                indices: "L'indice est caché dans le café, derrière le bar."
            },
            {
                titre: "Le Secret du Musée",
                description: "Résolvez l'énigme pour trouver le mot de passe qui vous mènera au prochain lieu.",
                difficulte: "Moyen",
                objectifs: "Identifier l'objet mystérieux,Trouver le mot de passe,Résoudre l'énigme",
                indices: "Le mot de passe se trouve dans le tableau de l'artiste."
            }
        ]

        for (const mission of missions) {
            // Vérifier si la mission existe déjà
            const existingMission = await dbInstance.get(
                "SELECT * FROM missions WHERE titre = ?",
                [mission.titre]
            )

            if (!existingMission) {
                // Insertion de la mission
                await dbInstance.run(
                    `INSERT INTO missions (titre, description, difficulte, objectifs, indices) VALUES (?, ?, ?, ?, ?)`,
                    [mission.titre, mission.description, mission.difficulte, mission.objectifs, mission.indices]
                )
                console.log(`Mission créée : ${mission.titre}`)
            }
        }
    } catch (error) {
        console.error("Erreur lors de la création des missions par défaut :", error)
    }
}

export async function getDB() {
    if (!dbInstance) {
        throw new Error("initDB must be called before getDB")
    }
    return dbInstance
}
