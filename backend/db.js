import { open } from "sqlite"

export async function initDB() {
    dbInstance = await open({
        filename: "db/database.sqlite"
    })
}