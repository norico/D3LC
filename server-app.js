const {host}  = require('./config')
const express = require('express')
const app = express()
const http = require('http')
const httpServer = http.Server(app)
const io = require('socket.io')(httpServer)

app.get('/', (req, res) =>{
    res.sendFile(__dirname +'/public/overlay.html')
})
httpServer.listen(3000, ()=>{
    console.log("http://localhost:3000")
})

io.on('connection', (socket) =>{
    console.log('Demande du counter')
    if( global.counter === 'undefined' ) {
        console.log('must refresh')
    }else {
        send( global.counter )
    }
})

io.on('overlay', (socket) =>{
    console.log('Demande du counter :: Overlay')
})

function send(data) {
    io.emit('message:overlay', data)
};
module.exports.send = function (data) { send( data ) };
