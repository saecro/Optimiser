const os = require('os');
const diskinfo = require('node-disk-info');

function getSystemInfo() {
  // Get CPU information
  const cpus = os.cpus();
  const cpuModel = cpus[0].model;
  const numCores = cpus.length;
  const cpuSpeed = cpus[0].speed;
  const cpuUsage = process.cpuUsage();

  // Get RAM information
  const totalRAM = os.totalmem();
  const freeRAM = os.freemem();
  const usedRAM = totalRAM - freeRAM;
  const ramUsagePercent = ((usedRAM / totalRAM) * 100).toFixed(2);

  // Get operating system information
  const osType = os.type();
  const osRelease = os.release();
  const osUptime = os.uptime();
  const osLoadAvg = os.loadavg();

  // Get network information
  const networkInterfaces = os.networkInterfaces();
  const primaryInterface = Object.values(networkInterfaces).find(iface => iface && iface.length > 0);
  const ipAddress = primaryInterface ? primaryInterface[0].address : 'Unknown';
  const macAddress = primaryInterface ? primaryInterface[0].mac : 'Unknown';

  // Format values
  const formatBytes = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours} hours, ${minutes} minutes, ${secs} seconds`;
  };

  return diskinfo.getDiskInfo().then((disks) => {
    const primaryDisk = disks[0]; // Assumes the first disk is the primary disk
    const totalStorage = primaryDisk.blocks;
    const freeStorage = primaryDisk.available;
    const usedStorage = totalStorage - freeStorage;
    const storageUsagePercent = ((usedStorage / totalStorage) * 100).toFixed(2);

    const systemInfo = `
=== System Information ===
CPU Model: ${cpuModel}
Number of Cores: ${numCores}
CPU Speed: ${(cpuSpeed / 1000).toFixed(2)} GHz
CPU Usage: ${JSON.stringify(cpuUsage)}
---------------------------
Total RAM: ${formatBytes(totalRAM)}
Used RAM: ${formatBytes(usedRAM)}
Free RAM: ${formatBytes(freeRAM)}
RAM Usage: ${ramUsagePercent}%
---------------------------
Total Storage: ${formatBytes(totalStorage)}
Used Storage: ${formatBytes(usedStorage)}
Free Storage: ${formatBytes(freeStorage)}
Storage Usage: ${storageUsagePercent}%
---------------------------
Operating System: ${osType}
OS Release: ${osRelease}
System Uptime: ${formatTime(osUptime)}
System Load Average (1, 5, 15 min): ${osLoadAvg}
---------------------------
IP Address: ${ipAddress}
MAC Address: ${macAddress}
`;

    return systemInfo;
  });
}

module.exports = getSystemInfo;