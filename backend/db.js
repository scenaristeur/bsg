import { open } from "sqlite"
import sqlite3 from "sqlite3"

let dbInstance = null

export async function initDB() {
    dbInstance = await open({
        filename: "db/database.sqlite",
        driver: sqlite3.Database
    })

    // email       TEXT        NOT NULL,
    // password    
    await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS users (
    id          INTEGER     PRIMARY KEY AUTOINCREMENT,
    name        TEXT        NOT NULL,

    createdAt   DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP
    )    
    `)

    // await dbInstance.exec('CREATE TABLE tbl (col TEXT)')
    // await dbInstance.exec('INSERT INTO tbl VALUES ("test")')

}

export async function getDB() {
    if (!dbInstance) {
        throw new Error("initDB must be called before getDB")
    }
    return dbInstance
}