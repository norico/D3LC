const {ipcRenderer} = require('electron')

let counter = get_key('counter', 0)
document.getElementById('counter').innerText = counter.toString()
ipcRenderer.send('message', {"counter": counter })

function get_key(key, default_value="false") {
    return localStorage.getItem(key) ?? default_value
}

ipcRenderer.on('message', (event, args) => {
    let key = args.key
    let value = args.value
    let counter = parseInt( document.getElementById('counter').innerText )
    if( key === 'shortcut'){
        switch (value){
            case 'ADD':
                counter++
                break
            case 'REMOVE':
                if (counter > 0 ){
                    counter--
                }
                break
            case 'RESET':
                counter = 0
                break
            default:
                console.log('Error')
                break
        }
        document.getElementById('counter').innerText = counter.toString()
        localStorage.setItem('counter', counter.toString())
        ipcRenderer.send('message', {"counter" : counter.toString() })
    }

})



