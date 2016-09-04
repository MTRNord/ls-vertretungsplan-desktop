const {app, BrowserWindow, dialog, globalShortcut} = require('electron')
const autoUpdater = require('electron').autoUpdater
const os = require("os")

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function update () {
  console.warn("Starting Autoupdater")
  console.warn(app.getVersion())
  var feedUrl = 'https://ls-desktop.herokuapp.com/update/' + os.platform() + '/' + app.getVersion() + '/';
  autoUpdater.setFeedURL(feedUrl);

  autoUpdater.checkForUpdates()

  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {

    var index = dialog.showMessageBox(mainWindow, {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: "Lornsenschule Vertretungsplan",
      message: i18n.__('The new version has been downloaded. Please restart the application to apply the updates.'),
      detail: releaseName + "\n\n" + releaseNotes
    });

    if (index === 1) {
      return;
    }

    autoUpdater.quitAndUpdate();
  });
}

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600, icon: __dirname + '/LS.ico', title: 'Lornsenschule Vertretungsplan'})

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/index.html`)

  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
  update()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
if(require('electron-squirrel-startup')) return;
var handleStartupEvent = function() {
  if (process.platform !== 'win32') {
    return false;
  }

  var squirrelCommand = process.argv[1];
  switch (squirrelCommand) {
    case '--squirrel-install':
    case '--squirrel-updated':

      // Optionally do things such as:
      //
      // - Install desktop and start menu shortcuts
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Always quit when done
      app.quit();

      return true;
    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Always quit when done
      app.quit();

      return true;
    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated
      app.quit();
      return true;
  }
};

if (handleStartupEvent()) {
  return;
}