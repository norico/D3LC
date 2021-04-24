const {app, BrowserWindow, ipcMain, globalShortcut, screen} = require('electron')
const {shortcuts, config} = require('./config')
const server = require('./server')

let mainWindow = null

app.on('ready', ()=>{
    createMainWindow()
})


function createMainWindow(){
    mainWindow = new BrowserWindow({
        width: 100,
        height: 100,
        resizable:false,
        minimizable:true,
        maximizable:false,
        title: config.name,
        icon: config.icon,
        autoHideMenuBar:true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })
    app.setName( config.name )
    createShortcuts()
    let { width, height } = screen.getPrimaryDisplay().workAreaSize

    let posX = width-mainWindow.getSize()[0]-5
    let posY = height-mainWindow.getSize()[1]-5
    mainWindow.setBounds({ x: posX, y: posY })
    mainWindow.loadURL(`file://${__dirname}/index.html`).then(mainWindow.show())
    if ( config.dev === true ){
        mainWindow.webContents.openDevTools()
    }
    console.log(app.name + " Started")
}

function createShortcuts(){
    globalShortcut.register(shortcuts.ADD_KEY, () => {
        mainWindow.send('message', { 'key':'shortcut', 'value':'ADD'})
    })
    globalShortcut.register(shortcuts.REMOVE_KEY, () => {
        mainWindow.send('message', { 'key':'shortcut', 'value':'REMOVE'})
    })
    globalShortcut.register(shortcuts.RESET_KEY, () => {
        mainWindow.send('message', { 'key':'shortcut', 'value':'RESET'})
    })
}

app.on('window-all-closed', () => {
    app.quit()
    console.log(app.name + " END")
})

ipcMain.on('message', (event, arg) => {
    const counter = arg.counter
    console.log( `new counter value = ${counter}`  )
    server.send({"counter":counter})
})
