const env = require('dotenv')
const {app, BrowserWindow, ipcMain, globalShortcut } = require('electron')
const path = require('path')
const {shortcuts, config} = require('./config')
const server = require('./server-app')

let mainWindow = null
app.on('ready', ()=>{
    createGlobalShortcuts()
    createMainWindow()
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
    mainWindow = new BrowserWindow({
        show:false,
        autoHideMenuBar:true,
        width: 200,
        height: 200,
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
    mainWindow.show()
    //mainWindow.webContents.openDevTools()
}
ipcMain.on('counter:init', () => {
    mainWindow.send('message', 'init')
})
ipcMain.on('counter:value', (event, counter_value) => {
    server.send(counter_value)
    global.counter = counter_value
})
