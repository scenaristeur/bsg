import { open } from "sqlite"
import sqlite3 from "sqlite3"

let dbInstance = null

export async function initDB() {
    dbInstance = await open({
        filename: "db/database.sqlite",
        driver: sqlite3.Database
    })

    dbInstance.on('trace', (data) => {
        console.log(data)
    })

    // email       TEXT        NOT NULL,
    // password    
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

}

export async function getDB() {
    if (!dbInstance) {
        throw new Error("initDB must be called before getDB")
    }
    return dbInstance
}