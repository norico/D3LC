const { app , BrowserWindow, Menu, ipcMain, globalShortcut } = require('electron')
const { screen, remote } = require('electron')

const config = require('./front/config')

const template_menu = require('./front/menu-template')
const menu = Menu.buildFromTemplate(template_menu)

let mainWindow = null


app.whenReady().then(
    createMainWindow
)

function createMainWindow() {
    mainWindow = new BrowserWindow({
        show:false,
        resizable:false,
        frame: true,
        width: 360,
        height: 140,
        minimizable:false,
        autoHideMenuBar:true,
        icon: './front/diablo-iii.png',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    //Set window position to bottom right of main screen
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    let posX = width-mainWindow.getSize()[0]-5
    let posY = height-mainWindow.getSize()[1]-5
    mainWindow.setBounds({ x: posX, y: posY })

    mainWindow.loadURL(`file://${__dirname}/front/index.html`).then(mainWindow.show())
    Menu.setApplicationMenu(menu)
    app.setName(app.name)
    createShortcuts()
    console.log(app.name + " Started")
}

app.on('window-all-closed', () => {
    app.quit()
    console.log(app.name + " END")
})

ipcMain.on('menu', (event, args)=>{
    if ( args.value === "true" ){
        Menu.getApplicationMenu().getMenuItemById(args.key).checked = args.value
    }
})

ipcMain.on('counter', (event, counter)=>{
    // Receive signal to update app title with counter value
    // mainWindow.setTitle(app.name+' '+ counter)
})


function createShortcuts() {
    globalShortcut.register(config.shortcuts.ADD_KEY, () => {
        mainWindow.send('shortcut', 'ADD')
    })
    globalShortcut.register(config.shortcuts.REMOVE_KEY, () => {
        mainWindow.send('shortcut', 'REMOVE')
    })
    globalShortcut.register(config.shortcuts.RESET_KEY, () => {
        mainWindow.send('shortcut', 'RESET')
    })
}

