const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const bodyParser = require('body-parser')

const httpServer = http.createServer(app);

const PORT = process.env.PORT || 8080

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(express.json())

app.use(require("./routes"))

httpServer.listen(PORT,
    console.log(`listening on port ${PORT}`)
)