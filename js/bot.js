require('dotenv').config();
const diskinfo = require('node-disk-info');
const fs = require('fs');
const si = require('systeminformation');
const Discord = require('discord.js');
const os = require('os')
const { botToken } = require('../config.json')
const screenshot = require('screenshot-desktop')
const { MessageAttachment } = require('discord.js');
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
                options: [
                    {
                        name: "optimisation_types",
                        description: "options to get detailed information",
                        type: Discord.ApplicationCommandOptionType.String,
                        choices: [
                            {
                                name: "Get PC Stats",
                                value: "get-pc-stats",
                            },
                            {
                                name: "Clear Useless Files",
                                value: "clear-useless-files",
                            },
                            {
                                name: "Disk Cleanup",
                                value: "disk-cleanup",
                            },
                            {
                                name: "Defragment Disk",
                                value: "defragment-disk",
                            },
                            {
                                name: "Update Drivers",
                                value: "update-drivers",
                            },
                            {
                                name: "Disable Startup Programs",
                                value: "disable-startup-programs",
                            },
                            {
                                name: "Optimize Network Settings",
                                value: "optimize-network",
                            },
                            {
                                name: "Repair System Files",
                                value: "repair-system-files",
                            },
                            {
                                name: "Manage Power Settings",
                                value: "manage-power-settings",
                            },
                        ],
                    },
                ]
            },
            {
                name: 'capture',
                description: 'Takes an image of the current desktop',
            },
            {
                name: 'pcstats',
                description: 'sends a list of your current pc stats',
            }
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
>Misc
.help || .cmds - Sends this
.settings - Shows bot.js settings
.utilities - Shows bot.js utilitie
@bot [prefix (optional)] - Sets prefix/shows info

>Bots
.launch [user || user,user1,etc || all || offline || amount] (placeid) - Launches account into game, placeid defaults to Pls Donate if there is none
.stop - Stops launching/relaunching accounts.
.remove [user || user,user1,repeat || all || amount] - Moves the account into "accountstore.json"
.restore [user || user,user1,repeat || all || amount] - Moves the account into "accounts.json"
.premove || .void [accounts || accountstore] [user || user,user1,repeat || all || amount] - Permamently deletes the specificed users
.terminate || .term [optional number] - Terminates all/specified instances

>Info
.accountStatus || .accounts || .acc - Shows if accounts are online or offline
.stats || .pcStats - Shows CPU, PC temp, Ram usage, uptime, total earned during session
.robuxAmount || .ra - Get balance of all your accounts
.robuxAmountl || .ral - Total balance without accounts listed
.transfer [user to trasnfer to] [shirt id] - Transfer Robux to one account
.adurite - Automatically adds all bots in utils to adurite
.cookies [user || user,user1,repeat || amount] - Dms you account cookies
.uconfig - Dms you your util config with personal details excluded

>Customisation
.gen [number || accounts] - Generates new accounts
.avatar [username || "all"] [user to copy] - Copies a user's avatar
.displayname || .dis [username or "all"] [Displayname}- Changes display name of accounts
.block [username || "all"] - Blocks all accounts
.gamepass [username || "all"] - Sets up gamepass
.group [username || "all"] - Joins a Roblox group for you

>PC
.screenshot || .sc - Sends a screenshot of your pc
.restartbot || .reb - Restarts the Discord bot
.shutdownbot || .offb - Turns the Discord bot off
.restart || .re - Restarts you pc
.shutdown || .off - Shuts down pc\`\`\``
        );
    } else if (interaction.commandName == "settings") {
        await interaction.reply(
            `**Settings:** 
\`\`\`
${botversion}
>Toggleable
.startlaunch || .sl [true/false] - Makes bots automatically launch offline on startup.
.antiratelimit || .ar [true/false] - Prevents you from experiencing synapse rate limits, account relaunch logic is changed.
.autoban || .ab [true/false] - Automatically removes banned accounts.
.autogen || .ag [true/false] - Automatically generates accounts when a banned one gets removed (pairs with .autoban).
.autominimize || .amin [true/false] - Enables or disables autominimize.
.autorelaunch || .arl [true/false] - Auto relaunches accounts upon exit.
.anonymous || .anon [true/false] - Makes launching/.acc accounts anonymous.

>Values
.autorelaunchdelay || .ald [number] - Changes the delay between accounts relaunching.
.launchdelay || .ld [number] - Changes the delay between accounts launching.
.autominimizedelay || .amdel - Changes the time between an account launching and then being minimized.

>Status Customisation
.rbx [acc/accs/all] - Total robux amount in status. This is a placeholder, doesnt work!

>Other
.prefix || .pre [prefix] - Changes the bots prefix to this.
.nopecha || .nkey [nopecha key] - Changes the nopechakey to this.
.placeid || .pid [place id] - Changes what experience the accounts launch to.

>Utils
.autogroup [true/false] - Automatically joins groups after generation.
.ramautoimport || .rai [true/false] - Automatically imports accounts to ram after generation.
.mainaccount || .ma [Main account] - Sets this as your main account in utils.

>Values
.setvals - Shows what the values of every command is.\`\`\``
        );
    } else if (interaction.commandName === 'capture') {
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
    } else if (interaction.commandName === 'pcstats') {
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

            const message =
                `\`\`\`
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
\`\`\``;

            await interaction.reply(message);
        } catch (error) {
            console.error('Error retrieving system information:', error);
            await interaction.reply('An error occurred while retrieving system information.');
        }

    }
});

client.login(process.env.discord)