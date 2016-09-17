const {app, BrowserWindow, dialog, globalShortcut, Tray, Menu, crashReporter} = require('electron')
const autoUpdater = require('electron').autoUpdater
const os = require("os")
const path = require('path');
const iconPath = path.join(__dirname, 'LS.png');
const electronLocalshortcut = require('electron-localshortcut');
const packageJSON = require('./package.json');
const deps = packageJSON.dependencies;
const request = require('request');
const fs = require('fs')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let tray
let menu
let appIcon

crashInit()

function crashInit() {
  crashReporter.start({
    productName: 'Lornsenschule Vertretungsplan Desktop',
    companyName: 'Nordgedanken.de',
    submitURL: 'http://ls-crash-report-server.herokuapp.com',
    autoSubmit: true
  })
  console.log(crashReporter.getLastCrashReport());
}

function update () {
  var feedUrl = 'http://ls-desktop.herokuapp.com/update/' + os.platform() + '_' + os.arch() + '/' + app.getVersion() + '/';
  autoUpdater.setFeedURL(feedUrl);

  setTimeout(function() {autoUpdater.checkForUpdates()}, 30000);
  autoUpdater.on('checking-for-update', function() {
    tray.displayBalloon({
      title: 'Autoupdater',
      content: 'Es wird nach Updates geprüft!'
    })
  });

  autoUpdater.on("error", (err) => {
    crashInit()
    tray.displayBalloon({
      title: 'Autoupdater',
      content: 'Ein Fehler ist aufgetreten!'
    })
  })

  autoUpdater.on('update-available', function() {
      tray.displayBalloon({
        title: 'Autoupdater',
        content: 'Es gibt ein Update!'
      })
  });

  autoUpdater.on('update-not-available', function() {
    tray.displayBalloon({
      title: 'Autoupdater',
      content: 'Es gibt kein Update!'
    })
  });


  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {

    var index = dialog.showMessageBox({
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: "Lornsenschule Vertretungsplan",
      message: ('The new version has been downloaded. Please restart the application to apply the updates.'),
      detail: releaseName + "\n\n" + releaseNotes
    });

    if (index === 1) {
      return;
    }

    quitAndUpdate()
  });
}

function createWindow () {
  process.on('uncaughtException', (err) => {
    crashInit()
  });
  // Create the browser window.
  win = new BrowserWindow({width: 1000, height: 800, icon: __dirname + '/LS.ico', title: 'Lornsenschule Vertretungsplan'})

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/index.html`)

  //win.webContents.openDevTools()

  var trayMenu = Menu.buildFromTemplate([
    {
      label: 'Refresh Data',
      accelerator: 'Ctrl+R',
      click: function() {
        win.reload();
      }
    },
    {
      label: 'Toggle DevTools',
      accelerator: 'Alt+Command+I',
      click: function() {
        win.show();
        win.toggleDevTools();
      }
    },
    {
      label: 'Quit',
      accelerator: 'Ctrl+Q',
      click: function() {
        app.isQuiting = true
        if (process.platform !== 'darwin') {
          app.quit()
        }
      }
    }
  ]);
  var windowMenu = Menu.buildFromTemplate([
    {
      label: 'Datei',
      submenu: [
        {
          label: 'Refresh Data',
          accelerator: 'Ctrl+R',
          click: function() {
            win.reload();
          }
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'Alt+Ctrl+I',
          click: function() {
            win.show();
            win.toggleDevTools();
          }
        },
        {
          label: 'Quit',
          accelerator: 'Ctrl+Q',
          click: function() {
            app.isQuiting = true
            if (process.platform !== 'darwin') {
              app.quit()
            }
          }
        }
      ]
    }
  ]);
  electronLocalshortcut.register(win, 'Ctrl+R', () => {
    win.reload();
  });
  electronLocalshortcut.register(win, 'Alt+Ctrl+I', () => {
    win.show();
    win.toggleDevTools();
  });
  electronLocalshortcut.register(win, 'Ctrl+Q', () => {
    app.isQuiting = true
    if (process.platform !== 'darwin') {
      app.quit()
    }
  });
  tray = new Tray(iconPath)
  tray.setToolTip('Lornsenschule Schleswig Vertretungsplan')
  win.setMenu(windowMenu);
  tray.setContextMenu(trayMenu);

  win.on('show', () => {
    tray.setHighlightMode('always')
  })

  tray.on('click', () => {
    win.isVisible() ? win.hide() : win.show()
  })

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  win.on('minimize',function(event){
      event.preventDefault()
      win.hide();
  });

  win.on('close', function (event) {
      if( !app.isQuiting){
          event.preventDefault()
          win.hide();
      }
      return false;
  });

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
  app.isQuiting = true
  if (process.platform !== 'darwin') {
    app.quit()
    electronLocalshortcut.unregisterAll(win);
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

      fs.unlink("uncaughtException.log")
      fs.unlink("error.log")

      // Always quit when done
      app.isQuiting = true
      app.quit();

      return true;
    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Always quit when done
      app.isQuiting = true
      app.quit();

      return true;
    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated
      app.isQuiting = true
      app.quit();
      return true;
  }
};

if (handleStartupEvent()) {
  return;
}
