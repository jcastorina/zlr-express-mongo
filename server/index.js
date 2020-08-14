const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')

const httpServer = http.createServer(app);

const PORT = process.env.PORT || 8080

app.use(cors())

app.use(require("./routes"))

httpServer.listen(PORT,
    console.log(`listening on port ${PORT}`)
)