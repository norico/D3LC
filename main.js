const {app, BrowserWindow, globalShortcut, ipcMain} = require('electron');
const overlay = require('./overlay')

app.on('ready', ()=>{
    createMainWindow()
    createShortcuts()
})

function createMainWindow() {
    mainWindow = new BrowserWindow({
        show:true,
        width: 300,
        height:200,
        resizable: true,
        maximizable:false,
        minimizable:true,
        title: app.name,
        icon: './diablo-iii.png',
        autoHideMenuBar:true,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false
        }
    })
    mainWindow.loadURL(`file://${app.getAppPath()}/electron.html`)
    // mainWindow.webContents.openDevTools({ mode: 'detach' })
}
function createShortcuts() {
    globalShortcut.register('F6', () => { mainWindow.send('ipc:counter', 'increment') })
    globalShortcut.register('F7', () => { mainWindow.send('ipc:counter', 'decrement') })
    globalShortcut.register('Alt+CommandOrControl+F1', () => { mainWindow.send('ipc:counter', 'reset') })
}

ipcMain.on('ipc:counter', (event, value) =>{
    overlay.UpdateCounter(value)
})

function getCounterValue() {
    let value = mainWindow.send('ipc:counter', 'currentValue')
}
module.exports =  {
    'getCounterValue' : getCounterValue
}


