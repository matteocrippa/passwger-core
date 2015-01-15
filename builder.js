var NwBuilder = require('node-webkit-builder');
var nw = new NwBuilder({
  files: './dev/**', // use the glob format
  downloadUrl: 'http://dl.nwjs.io/',
  //platforms: ['osx32', 'osx64', 'win32', 'win64']
  platforms: ['osx64'],
  macIcns: './icon/icon.icns',
  winIco: './icon/icon.ico',
  version: '0.11.5'
});

//Log stuff you want

nw.on('log',  console.log);

// Build returns a promise
nw.build().then(function () {
  console.log('all done!');
}).catch(function (error) {
  console.error(error);
});
