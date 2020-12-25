const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.json([
    {
        name: 'Bob',
        email: 'bob@gmail.com',
    },
    {
        name: 'Alice',
        email: 'alice@gmail.com',
    },
    {
        name: 'Carol',
        email: 'carol@gmail.com',
    },
    {
        name: 'Eve',
        email: 'eve@gmail.com',
    },
]))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})