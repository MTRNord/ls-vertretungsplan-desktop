/* eslint global-require: 1, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, Tray, dialog, Menu } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import MenuBuilder from './menu';

let mainWindow = null;
let tray;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};

function update() {
  setTimeout(() => { autoUpdater.checkForUpdates(); }, 5000);
  autoUpdater.on('checking-for-update', () => {
    tray.displayBalloon({
      title: 'Autoupdater',
      content: 'Es wird nach Updates geprüft!'
    });
  });

  autoUpdater.on('error', () => {
    tray.displayBalloon({
      title: 'Autoupdater',
      content: 'Ein Fehler ist aufgetreten!'
    });
  });

  autoUpdater.on('update-available', () => {
    tray.displayBalloon({
      title: 'Autoupdater',
      content: 'Es gibt ein Update!'
    });
  });

  autoUpdater.on('update-not-available', () => {
    tray.displayBalloon({
      title: 'Autoupdater',
      content: 'Es gibt kein Update!'
    });
  });


  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) => {
    const index = dialog.showMessageBox({
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Lornsenschule Vertretungsplan',
      message: ('The new version has been downloaded. Please restart the application to apply the updates.'),
      detail: `${releaseName}\n\n${releaseNotes}`
    });

    if (index === 1) {
      return;
    }

    quitAndUpdate();
  });
}

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  const trayMenu = Menu.buildFromTemplate([
    {
      label: 'Refresh Data',
      accelerator: 'Ctrl+R',
      click: () => {
        mainWindow.reload();
      }
    },
    {
      label: 'Toggle DevTools',
      accelerator: 'Alt+Command+I',
      click: () => {
        mainWindow.show();
        mainWindow.toggleDevTools();
      }
    },
    {
      label: 'Quit',
      accelerator: 'Ctrl+Q',
      click: () => {
        app.isQuiting = true;
        if (process.platform !== 'darwin') {
          app.quit();
        }
      }
    }
  ]);

  const iconPath = path.join(__dirname, 'LS.png');
  tray = new Tray(iconPath);
  tray.setToolTip('Lornsenschule Schleswig Vertretungsplan');
  tray.setContextMenu(trayMenu);

  mainWindow.on('show', () => {
    tray.setHighlightMode('always');
  });

  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
    update();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});
