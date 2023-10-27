const { app, BrowserWindow } = require('electron')

const createWindow = () => {
    const win = new BrowserWindow({
        //fullscreen: true,
        width: 1800,
        height: 1000,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            nodeIntegrationInWorker: true
        }
    })

    win.loadFile('index.html')
    win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow()
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})