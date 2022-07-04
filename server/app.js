const express = require('express')
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cors())
app.use('/images', express.static('images'));

// Router
app.use('/auth', require('./routes/auth'))
app.use('/anggota', require('./routes/anggota'))
app.use('/algo', require('./routes/algoritma'))
app.use('/buku', require('./routes/buku'))
app.use('/pinjam-buku', require('./routes/buku.pinjam'))
app.use('/pengembalian-buku', require('./routes/buku.pengembalian'))

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000/",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
})

io.on("connection", (socket) => {
    console.log("a user connected");
})

server.listen(8080)

module.exports = server