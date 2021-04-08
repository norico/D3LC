// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const {ipcRenderer} = require('electron')

ipcRenderer.send('counter-init') // Request counter value from electon
ipcRenderer.on('counter-init', (event, data) => {
    console.log('Receive value of data from main', data)
    document.getElementById("counter").innerText = data
})

ipcRenderer.on('counter-value', (event, data) => {
    let counter_value = document.getElementById('counter').innerText
    ipcRenderer.send('counter-value',  counter_value )
})

ipcRenderer.on('ADD', (event) => {
    let counter_value = document.getElementById('counter').innerText
    counter_value = parseInt(counter_value)+1
    document.getElementById("counter").innerText = counter_value
})

ipcRenderer.on('REMOVE', (event) => {
    let counter_value = document.getElementById('counter').innerText
    if( counter_value > 0 ) {
        counter_value = parseInt(counter_value)-1
    }
    document.getElementById("counter").innerText = counter_value
})

ipcRenderer.on('RESET', (event) => {
    document.getElementById("counter").innerText = '0'
})

ipcRenderer.on('SAVE', (event) => {
    ipcRenderer.send('counter-save',  document.getElementById('counter').innerText )
})
