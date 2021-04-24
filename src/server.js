const {host}  = require('./config')
const path = require('path')

const express = require('express')
const app = express()
const http = require('http')
const httpServer = http.Server(app)
const io = require('socket.io')(httpServer)




app.get('/', (req, res) =>{
    res.sendFile(__dirname +'/public/home.html')
})

app.get('/overlay', (req, res) =>{
    res.sendFile(__dirname +'/public/overlay.html')
})
io.on('connection', (socket) =>{
    //TODO Request value to node
})
httpServer.listen(3000, ()=>{
    console.log("http://localhost:3000")
})

module.exports.send = function (data) {
    io.emit('message:overlay', data)
};







