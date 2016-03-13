var NwBuilder = require('nw-builder');
var nw = new NwBuilder({
    files: './cache', // use the glob format
    platforms: ['win', 'linux'],
    version: '0.0.1'
});

//Log stuff you want

nw.on('log',  console.log);

// Build returns a promise
nw.build().then(function () {
   console.log('all done!');
}).catch(function (error) {
    console.error(error);
});
