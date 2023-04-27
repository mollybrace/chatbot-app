const PORT = 8000;
const express = require("express")
const cors = require("cors")
const app = express()
const dotenv = require("dotenv").config()
app.use(express.json())
app.use(cors())

const API_KEY = process.env.API_KEY

app.post("/completion", async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model : "gpt-3.5-turbo",
            messages: [{ role: "user", content: req.body.message}],
        })
    }
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", options)
        const data = await response.json() //response json is an async function so needs await
        res.send(data)
    } catch (error) {
        console.log(error)
    }
})

app.listen(PORT, () => console.log(`Your server is running on port ${PORT}`))