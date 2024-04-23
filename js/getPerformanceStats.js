const os = require('os');

console.log(os.cpus());
console.log((os.totalmem() / 1024 / 1024).toFixed(0));
console.log((os.freemem() / 1024 / 1024).toFixed(0))
