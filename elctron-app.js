const env = require('dotenv')
const {app, BrowserWindow, ipcMain, globalShortcut, screen, Notification, Tray, Menu  } = require('electron')
const path = require('path')
const {shortcuts, config} = require('./config')
const server = require('./server-app')

let mainWindow = null
let tray = null

app.on('ready', ()=>{
    createGlobalShortcuts()
    createMainWindow()
    createTray()
    setWindowPos()
})
app.on('window-all-closed', () => {
    app.quit()
    console.log(app.name + " END")
})
function createGlobalShortcuts(){
    const ADD = globalShortcut.register(shortcuts.ADD_KEY, () => {
        mainWindow.send('message', 'add')
    })
    const REMOVE = globalShortcut.register(shortcuts.REMOVE_KEY, () => {
        mainWindow.send('message', 'remove')
    })
    const RESET = globalShortcut.register(shortcuts.RESET_KEY, () => {
        mainWindow.send('message', 'reset')
    })
}
function createMainWindow(){
    console.log(process.type)
    mainWindow = new BrowserWindow({
        show:false,
        autoHideMenuBar:true,
        width: 180,
        height: 180,
        resizable:false,
        maximizable:true,
        maximizable:false,
        allowFullscreen: false,
        title: config.name,
        icon: config.icon,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })
    mainWindow.loadURL(`file://${__dirname}/index.html`)
    //mainWindow.webContents.openDevTools()


}
function createTray(counter){
    tray = new Tray( config.icon )
    trayEvent()
}

function setWindowPos() {
    const {width, height} = screen.getPrimaryDisplay().workAreaSize
    mainWindow.setBounds({
        x: width - mainWindow.getSize()[0] - 5,
        y: height - mainWindow.getSize()[1] - 5
    })
}

function trayEvent(){
    const isMac = process.platform === 'darwin'
    tray.setToolTip(config.name+' '+ app.getVersion())
    tray.displayBalloon({
        'title' : config.name,
        'content' : app.getVersion(),
        'largeIcon' : config.icon,
        'respectQuietTime' : true
    })
    tray.setContextMenu(Menu.buildFromTemplate([
        { 'label' : app.name+' '+app.getVersion(), 'enabled' : false },
        //{ role: 'toggleDevTools', 'visible': true },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' }
    ]))
    tray.on('click', (event)=>{
        mainWindow.isVisible() === true ? mainWindow.hide() : mainWindow.show()
    })
}

/* IPC */

ipcMain.on('counter:init', () => {
    mainWindow.send('message', 'init')
})

ipcMain.on('counter:value', (event, counter_value) => {
    server.send(counter_value)
    global.counter = counter_value
    /*
    let notify  = new Notification({
        'title' : app.name,
        'icon' : config.icon,
    })
    notify.body = counter_value.toString()
    // notify.show()
    */
})
