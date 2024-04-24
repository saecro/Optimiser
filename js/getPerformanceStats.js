const os = require('os');
const diskinfo = require('node-disk-info');

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

// Get disk information
const totalStorage = os.totalmem(); // Assumes the total storage is equal to the total RAM (modify as needed)
const freeStorage = os.freemem(); // Assumes the free storage is equal to the free RAM (modify as needed)
const usedStorage = totalStorage - freeStorage;
const storageUsagePercent = ((usedStorage / totalStorage) * 100).toFixed(2);

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

diskinfo.getDiskInfo().then((disks) => {
    const primaryDisk = disks[0]; // Assumes the first disk is the primary disk
    const totalStorage = primaryDisk.blocks;
    const freeStorage = primaryDisk.available;
    const usedStorage = totalStorage - freeStorage;
    const storageUsagePercent = ((usedStorage / totalStorage) * 100).toFixed(2);
    console.log('=== System Information ===');
    console.log(`CPU Model: ${cpuModel}`);
    console.log(`Number of Cores: ${numCores}`);
    console.log(`CPU Speed: ${(cpuSpeed / 1000).toFixed(2)} GHz`);
    console.log(`CPU Usage: ${JSON.stringify(cpuUsage)}`);
    console.log('---------------------------');
    console.log(`Total RAM: ${formatBytes(totalRAM)}`);
    console.log(`Used RAM: ${formatBytes(usedRAM)}`);
    console.log(`Free RAM: ${formatBytes(freeRAM)}`);
    console.log(`RAM Usage: ${ramUsagePercent}%`);
    console.log('---------------------------');
    console.log(`Total Storage: ${formatBytes(totalStorage)}`);
    console.log(`Used Storage: ${formatBytes(usedStorage)}`);
    console.log(`Free Storage: ${formatBytes(freeStorage)}`);
    console.log(`Storage Usage: ${storageUsagePercent}%`);
    console.log('---------------------------');
    console.log(`Operating System: ${osType}`);
    console.log(`OS Release: ${osRelease}`);
    console.log(`System Uptime: ${formatTime(osUptime)}`);
    console.log(`System Load Average (1, 5, 15 min): ${osLoadAvg}`);
    console.log('---------------------------');
    console.log(`IP Address: ${ipAddress}`);
    console.log(`MAC Address: ${macAddress}`);
}).catch((error) => {
    console.error('Error retrieving disk information:', error);
});
