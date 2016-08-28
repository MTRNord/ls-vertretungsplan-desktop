var electronInstaller = require('electron-winstaller');
resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: 'prebuild/ls_vertretungsplan_desktop-win32-x64',
    outputDirectory: 'build',
    authors: 'Marcel Radzio',
    exe: 'ls_vertretungsplan_desktop.exe'
  });

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));