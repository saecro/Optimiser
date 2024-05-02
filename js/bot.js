const diskinfo = require('node-disk-info');
const fs = require('fs');
const si = require('systeminformation');
const Discord = require('discord.js');
const os = require('os')
const axios = require('axios')
const screenshot = require('screenshot-desktop')
const getHWID = require('./getHWID.js');
const botversion = 'v1'
const { token } = require('../config.json')

async function checkAndUpdateDetails() {
    const timezone = await Intl.DateTimeFormat().resolvedOptions().timeZone;
    const hwid = await getHWID()
    const response = await axios.get('http://localhost:3001/api/getbot-token', {
        params: {
            token,
            hwid,
            timezone,
        },
    });
    return response.data
}

const expectedContent =
    `@echo off
rem Checking if node.js is installed

where node.exe >nul 2>&1 && set message=true || set message=false
if exist node.msi del node.msi
if %message% == false (
curl -o node.msi https://nodejs.org/dist/v18.17.1/node-v18.17.1-x64.msi
if exist node.msi (
cls
start node.msi
echo Install Node.js then run this file again
pause
exit
) else (
echo fail
)
)

echo verifying modules...
node js/fix.js
@REM node ./js/updater.js


if not exist config.json (
  echo config.json not found. Please create the file with a valid token.
  pause
  exit
)

node js/startup.js

echo Validate the token
node js/validateToken.js
if errorlevel 1 (
  echo Invalid token. Please provide a valid token in config.json.
  pause
  exit
)

:ui
cls
title PC Optimiser V1 by saecro
echo option select
echo.
echo [1] Get PC stats
echo [2] Clear Useless Files
echo [3] Disk cleanup
echo [4] Defragment disk
echo [5] Update drivers
echo [6] Disable startup programs
echo [7] Run a discord bot
echo [8] Optimize network settings
echo [9] Repair system files
echo [10] Manage power settings
echo.
set /p o=
if %o% == 1 goto PCStats
if %o% == 2 goto clearFiles
if %o% == 3 goto diskCleanup
if %o% == 4 goto defragDisk
if %o% == 5 goto updateDrivers
if %o% == 6 goto disableStartup
if %o% == 7 goto runDiscordBot
if %o% == 8 goto optimizeNetwork
if %o% == 9 goto repairSystem
if %o% == 10 goto powerSettings
pause
goto ui
:PCStats
cls
node ./js/getPerformanceStats.js
pause
goto ui
:clearFiles
cls
echo WARNING THIS WILL DELETE THE FOLLOWING:
echo 1. DOWNLOADS
echo 2. RECYCLING BIN
echo 3. TEMPORARY FILES
echo TYPE 1 IF YOU ARE CERTAIN
set /p o=
if %o% == 1 goto confirmedClearFiles else 
(
pause
goto ui
)
:confirmedClearFiles
cls
node ./js/clearFiles.js
pause
goto ui
:diskCleanup
cls
node ./js/diskCleanup.js
pause
goto ui
:defragDisk
cls
node ./js/defragDisk.js
pause
goto ui
:updateDrivers
cls
node ./js/updateDrivers.js
pause
goto ui
:disableStartup
cls
node ./js/disableStartup.js
pause
goto ui
:runDiscordBot
cls
node ./js/bot.js
pause
goto ui
:optimizeNetwork
cls
node ./js/optimizeNetwork.js
pause
goto ui
:repairSystem
cls
node ./js/repairSystem.js
pause
goto ui
:powerSettings
cls
node ./js/powerSettings.js
pause
goto ui`.replace(/\s/g, '');

fs.readFile('./run.bat', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const actualContent = data.trim().replace(/\s/g, '');

    if (actualContent !== expectedContent) {
        console.log('tampering is a sin');
        process.exit(1);
    }

    console.log('Verified run.bat');
});

checkAndUpdateDetails()
    .then(({ discordUserId, botToken }) => {
        console.log(discordUserId, botToken)
        const client = new Discord.Client({
            disableEveryone: true,
            intents: [
                Discord.GatewayIntentBits.Guilds,
                Discord.GatewayIntentBits.GuildMessages,
            ]
        });

        client.on('ready', async () => {
            console.log(`Logged in as ${client.user.tag}!`);
            setInterval(async () => {
                try {
                    const cpuTemp = await si.cpuTemperature();
                    const usedRam = (os.totalmem() - os.freemem()) / (1024 * 1024 * 1024);

                    const statusText = `CPU Temp: ${cpuTemp.main ? cpuTemp.main + '°C' : 'N/A'}, Ram Usage: ${usedRam.toFixed(2)} GB`;

                    client.user.setPresence({
                        activities: [{ name: statusText, type: Discord.ActivityType.Watching }],
                    });
                } catch (error) {
                    console.error('Error updating bot status:', error);
                    client.user.setPresence({
                        activities: [{ name: 'Error retrieving system information', type: Discord.ActivityType.Watching }],
                    });
                }
            }, 5000);

            try {
                const commands = [
                    {
                        name: 'help',
                        description: 'Displays the help message',
                    },
                    {
                        name: 'capture',
                        description: 'Takes an image of the current desktop',
                    },
                    {
                        name: 'pcstats',
                        description: 'sends a list of your current pc stats',
                    },
                    {
                        name: 'shutdown',
                        description: 'Completely turns off your current machine',
                    },
                    {
                        name: 'shutdownbot',
                        description: 'Turns off the discord bot',
                    },
                    {
                        name: 'restart',
                        description: 'restarts your current machine',
                    },
                    {
                        name: 'restartbot',
                        description: 'restarts the discord bot',
                    },
                ];

                await client.application.commands.set(commands);
                console.log('Slash commands registered successfully.');
            } catch (error) {
                console.error('Error registering slash commands:', error);
            }
        });

        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isCommand()) return;

            if (interaction.commandName === 'help') {
                await interaction.reply(
                    `**Help:** 
        \`\`\`
        ${botversion}
        >Performance
        .setpriority [high/normal/low] - Sets the priority of the botting process to optimize resource allocation.
        .cpuaffinity [0-100] - Sets the CPU affinity for the botting process to limit CPU usage.
        .memoryLimit [MB] - Sets a memory usage limit for the botting process to prevent excessive memory consumption.
        .gpuacceleration [true/false] - Enables or disables GPU acceleration for the botting process.
        
        >Monitoring
        .monitor [true/false] - Enables or disables real-time monitoring of system resources.
        .logresources [true/false] - Enables or disables logging of system resource usage to a file.
        .alerts [true/false] - Enables or disables alerts when system resources exceed specified thresholds.
        .setalerts [cpu/memory/gpu] [threshold] - Sets the threshold for triggering alerts for specific system resources.
        
        >Automation
        .scheduleRestart [time] - Schedules an automatic restart of the botting process at the specified time.
        .scheduleShutdown [time] - Schedules an automatic shutdown of the PC at the specified time.
        .autopause [true/false] - Enables or disables automatic pausing of the botting process when system resources are low.
        .setpausethreshold [cpu/memory/gpu] [threshold] - Sets the threshold for triggering an automatic pause based on system resources.
        
        >Maintenance
        .clearcache - Clears the cache and temporary files associated with the botting process.
        .defragment - Defragments the hard drive to improve performance.
        .updatedrivers - Checks for and installs updated drivers for the system.
        .disablebackground [true/false] - Disables or enables background processes and services to free up resources.
        
        >Network
        .connectionspeed - Displays the current internet connection speed.
        .setbandwidthlimit [KB/s] - Sets a bandwidth limit for the botting process to prevent network congestion.
        .pingtest [server] - Performs a ping test to the specified server to check network latency.
        .dnsflush - Flushes the DNS cache to resolve network-related issues.
        \`\`\``)
            }
            if (interaction.user.id === discordUserId) {
                if (interaction.commandName === 'capture') {
                    try {
                        const img = await screenshot({ format: "png" });
                        await interaction.reply({
                            files: [{ attachment: img, name: "screenshot.png" }]
                        });
                    } catch (error) {
                        console.error('Error taking screenshot:', error);
                        try {
                            await interaction.reply('An error occurred while taking the screenshot.');
                        } catch (replyError) {
                            console.error('Error replying to interaction:', replyError);
                        }
                    }
                }
                else if (interaction.commandName === 'pcstats') {
                    try {
                        const cpus = os.cpus();
                        const cpuModel = cpus[0].model;
                        const numCores = cpus.length;
                        const cpuSpeed = cpus[0].speed;
                        const cpuUsage = process.cpuUsage();

                        const totalRAM = os.totalmem();
                        const freeRAM = os.freemem();
                        const usedRAM = totalRAM - freeRAM;
                        const ramUsagePercent = ((usedRAM / totalRAM) * 100).toFixed(2);

                        const osType = os.type();
                        const osRelease = os.release();
                        const osUptime = os.uptime();
                        const osLoadAvg = os.loadavg();

                        const networkInterfaces = os.networkInterfaces();
                        const primaryInterface = Object.values(networkInterfaces).find(iface => iface && iface.length > 0);
                        const ipAddress = primaryInterface ? primaryInterface[0].address : 'Unknown';
                        const macAddress = primaryInterface ? primaryInterface[0].mac : 'Unknown';

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

                        const disks = await diskinfo.getDiskInfo();
                        const primaryDisk = disks[0];
                        const totalStorage = primaryDisk.blocks;
                        const freeStorage = primaryDisk.available;
                        const usedStorage = totalStorage - freeStorage;
                        const storageUsagePercent = ((usedStorage / totalStorage) * 100).toFixed(2);

                        const message = `\`\`\`
=== System Information ===
CPU Model: ${cpuModel}
Number of Cores: ${numCores}
Current CPU Speed: ${(cpuSpeed / 1000).toFixed(2)} GHz
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
\`\`\``;

                        await interaction.reply(message);
                    } catch (error) {
                        console.error('Error retrieving system information:', error);
                        await interaction.reply('An error occurred while retrieving system information.');
                    }
                }
                else if (interaction.commandName === 'shutdownbot') {
                    await interaction.reply('shutting down the discord bot.')
                    await client.destroy()
                    process.exit(0)
                }
                else if (interaction.commandName === 'restartbot') {
                    // send channel a message that you're resetting bot [optional]
                    lastChannelID = interaction.channelId;
                    await interaction.reply('Resetting, will say back online in this channel.')
                        .then(msg => client.destroy())
                        .then(() => client.login(botToken))
                        .then(() => client.channels.cache.get(lastChannelID).send('back online.'));
                }

            } else {
                await interaction.reply(`You do not have permission to run this command. Only <@${discordUserId}> can run this command.`)
            }
        });
        client.login(botToken)
    })
    .catch((error) => {
        console.error('Failed to start the bot:', error);
        process.exit(1);
    });