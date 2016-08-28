var NwBuilder = require('nw-builder');
var nw = new NwBuilder({
    files: './app/**', // use the glob format
    platforms: ['win', 'linux'],
    version: 'latest',
    winIco: 'LS.ico'
});

//Log stuff you want

nw.on('log',  console.log);

// Build returns a promise
nw.build().then(function () {
   console.log('all done!');
}).catch(function (error) {
    console.error(error);
});
