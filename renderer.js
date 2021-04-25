const {ipcRenderer} = require('electron')

ipcRenderer.send('counter:init')

ipcRenderer.on('message', (event, data) => {
    counter( data )
})

function counter( action ) {
    console.log(` ${action} received `)
    switch (action){
        case "init":
            document.body.innerHTML = `<section><div id='counter'></div></section>`
            counter_value = localStorage.getItem('counter') || 0
            break
        case "add":
            counter_value = parseInt(document.getElementById("counter").innerText)
            counter_value++
            break
        case "remove":
            counter_value = parseInt(document.getElementById("counter").innerText)
            if( counter_value >0 ){
                counter_value--
            }
            break
        case "reset":
            counter_value = 0
            break
    }
    document.getElementById("counter").innerText = counter_value
    localStorage.setItem('counter', counter_value)
    ipcRenderer.send('counter:value', counter_value )
}
