const express = require('express')
const http = require('http')
const app = express()
const httpServer = http.Server(app)
httpServer.port = 9002
const io = require('socket.io')(httpServer)

app.get('/', (request, response) =>{
    response.sendFile(__dirname +"/overlay.html")
})

httpServer.listen(httpServer.port, ()=>{
    console.log("http://localhost:"+ httpServer.port )
})

io.on('connection', (socket) => {
    const {getCounterValue} = require('./main')
    value = getCounterValue()
})

function UpdateCounter(value) {
    io.emit('counter', value)
}
module.exports =  {
    'UpdateCounter' : UpdateCounter
}
