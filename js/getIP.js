const os = require('os')

function getIP() {
    return Object.values(os.networkInterfaces()).find(iface => iface && iface.length > 0)[0].address
}

module.exports = getIP;