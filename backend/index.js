import express from 'express'
const PORT = 3000

const app = express()

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


app.get("/about", (req, res) => {
    res.type("html")
    res.send("<h1>Bonjour</h1>")
})

app.listen(PORT, () => {
    console.log(`listening on  ${PORT}`)
})