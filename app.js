const electron = require('electron')
const { app, BrowserWindow } = electron
const path = require('path')
// electron.crashReporter.start()
var ipcServer = null

var mainWindow = null
var finderWindow = null

var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
  if (mainWindow) {
    if (process.platform === 'win32') {
      mainWindow.minimize()
      mainWindow.restore()
    }
    mainWindow.focus()
  }
  return true
})

if (shouldQuit) {
  app.quit()
  return
}

var mainWindow
app.on('ready', function () {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    minWidth: 420,
    minHeight: 320,
    webPreferences: {
      zoomFactor: 1.0,
      blinkFeatures: 'OverlayScrollbars'
    }
  })

  const url = path.resolve(__dirname, './index.html')

  mainWindow.loadURL('file://' + url)

  mainWindow.webContents.on('new-window', function (e) {
    e.preventDefault()
  })
})

module.exports = app

