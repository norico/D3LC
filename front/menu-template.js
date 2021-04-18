const {app ,ipcMain} = require('electron')
const shortcuts = require('./config').shortcuts


template = [
    {
        label: 'View',
        submenu: [
            {
                id: 'dark',
                label: 'Mode Sombre',
                type: 'checkbox',
                click: (item, focusedWindow) => {
                    focusedWindow.send('menu', {
                        "key": item.id,
                        "value":item.checked
                    })

                }
            },
            {
                id: 'stream',
                label: 'Fond vert',
                type: 'checkbox',
                click: (item, focusedWindow) => {
                    focusedWindow.send('menu', {
                        "key": item.id,
                        "value":item.checked
                    })

                }
            },
            { type: 'separator' },
            { role: 'zoomin' },
            { role: 'zoomout' },
            { role: 'resetZoom' },

        ]
    },
    {
        label: 'Action',
        submenu: [
            {
                label: 'Ajouter',
                accelerator: shortcuts.ADD_KEY,
                click: (item, focusedWindow) => {
                    focusedWindow.send('shortcut', "ADD")
                }
            },
            {
                label: 'Supprimer',
                accelerator: shortcuts.REMOVE_KEY,
                click: (item, focusedWindow) => {
                    focusedWindow.send('shortcut', "REMOVE")
                }
            },
            {
                label: 'Remettre à zéro',
                accelerator: shortcuts.RESET_KEY,
                click: (item, focusedWindow) => {
                    focusedWindow.send('shortcut', "RESET")
                }
            },
            { role: 'quit', accelerator: "alt+F4", }
        ]
    },
    {
        label: 'About',
        click: (item) => {
            app.setAboutPanelOptions( {
                iconPath: "./front/diablo-iii-64x64.png",
                applicationName: app.name,
                applicationVersion: "Ver " + app.getVersion(),
                credits: "Norico"
            })
            app.showAboutPanel()
        }
    },
    { role: 'toggleDevTools' }
]
module.exports = template
