const {app, BrowserWindow, ipcMain, globalShortcut} = require('electron')

const path = require('path')
const fs   = require('fs')

let window

function createWindow () {
    // Create the browser window.
    window = mainWindow = new BrowserWindow({
        width: 800,
        height: 600,

        icon: "diablo-iii.png",

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // and load the index.html of the app.
    // mainWindow.loadFile('index.html')
    mainWindow.loadURL(`file://${__dirname}/index.html`)
    // mainWindow.loadURL('index.html')

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

}

app.whenReady().then(() => {
    createWindow()
    createShortcuts()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

function createShortcuts(){
    const ADD = globalShortcut.register('F5', () => {
        console.log( 'F5 is pressed' )
        window.send('ADD')
    })
    const REMOVE = globalShortcut.register('F6', () => {
        console.log( 'F6 is pressed' )
        window.send('REMOVE')
    })
    const RESET = globalShortcut.register('Alt+CommandOrControl+F1', () => {
        console.log( 'CommandOrControl + ALT + F1  is pressed' )
        window.send('RESET')
    })

    const SAVE = globalShortcut.register('CommandOrControl+S', () => {
        console.log( 'CommandOrControl + S  is pressed' )
        window.send('SAVE')
    })
}

ipcMain.on('counter-init', (event) => {
    console.log("Electron request counter value (counter-init)")
    let counter_value = counter("read")
    event.sender.send('counter-init', counter_value)
})

ipcMain.on('counter-save', (event, data) => {
    console.log("Electron save data with value: " + data)
    counter("save", data)
})

ipcMain.on('counter-value', (event, data) => {
    console.log( 'counter ' + data )
})

app.on('quit', (event) => {

    ipcMain.emit('counter-value')

    globalShortcut.unregisterAll()
    if (process.platform !== 'darwin'){
        app.quit()
    }
    console.log('Done !')
})

function counter(action, data){
    let filename = "data.txt"
    if( action === "save"){
        console.log( 'Saving file ' + filename)
        fs.writeFile(filename, data, "utf-8", (error, data) => {
            if (error) {
                console.error("error: " + error);
            }
        })
    }
    if( action === "read"){
        try {
            fs.accessSync(filename, fs.constants.R_OK | fs.constants.W_OK)
            return fs.readFileSync(filename).toString()
        }
        catch {
            fs.writeFile(filename, '0', "utf-8", (error, data) => {
                if (error) {
                    console.error("error: " + error);
                }
            })
            return "0"
        }
    }
}
