const os = require('os');

// Get CPU information
const cpus = os.cpus();
const cpuSpeed = cpus[0].speed;

// Get RAM information
const totalRAM = os.totalmem();
const freeRAM = os.freemem();
const usedRAM = totalRAM - freeRAM;
const osUptime = os.uptime();

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

// Print system information
console.log('=== System Information ===');
console.log(`CPU Speed: ${(cpuSpeed/1000).toFixed(2)} GHz`);
console.log('---------------------------');
console.log(`Total RAM: ${formatBytes(totalRAM)}`);
console.log(`Used RAM: ${formatBytes(usedRAM)}`);
console.log(`Free RAM: ${formatBytes(freeRAM)}`);
console.log('---------------------------');
console.log(`System Uptime: ${formatTime(osUptime)}`);
