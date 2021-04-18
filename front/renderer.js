const {ipcRenderer} = require('electron')

let dark_value = get_key('dark')
ipcRenderer.send('menu', { 'key': 'dark', 'value' : dark_value})
set_key("dark", dark_value)

let stream_value = get_key('stream')
ipcRenderer.send('menu', { 'key': 'stream', 'value' : stream_value})
set_key("stream", stream_value)

ipcRenderer.on('menu', (event, args) => {
    localStorage.setItem(args.key, args.value )
    set_key( args.key, args.value.toString())
})

function get_key(key, default_value="false") {
    return localStorage.getItem(key) ?? default_value
}
function set_key(key,value) {

    switch (key) {
        case 'dark':
            if( value === "true"){
                document.body.classList.add('dark')
            }else {
                document.body.classList.remove('dark')
            }
            break

        case 'stream':
            if( value === "true"){
                document.body.classList.add('stream')
            }else {
                document.body.classList.remove('stream')
            }
            break

        case 'counter':
            document.getElementById('loading').remove()
            document.getElementById('counter').innerText = value
            break
    }
}

// Init APP
let counter = get_key('counter', 0)
set_key("counter", counter)
ipcRenderer.send('counter', counter) // send signal to initialize window title

// shortcuts actions
ipcRenderer.on('shortcut', (event, action) => {
    let counter = parseInt(document.getElementById('counter').innerText)
    switch (action) {
        case "ADD" :
            counter++
            break
        case "REMOVE" :
            if (counter > 0) {
                counter--
            }
            break
        case "RESET" :
            counter = 0
            break
    }
    counter = counter.toString()
    document.getElementById('counter').innerText = counter
    localStorage.setItem('counter', counter )
    ipcRenderer.send('counter', counter) // send signal to update window title
})
