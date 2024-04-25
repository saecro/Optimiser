const fs = require('fs');
const si = require('systeminformation');
const Discord = require('discord.js');
const os = require('os')
const { botToken } = require('../config.json')
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
:scanMalware
cls
node ./js/runDiscordBot.js
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
						name: "pc-optimizer",
						description: "Optimize your PC's performance",
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
		];

		await client.application.commands.set(commands);
		console.log('Slash commands registered successfully.');
	} catch (error) {
		console.error('Error registering slash commands:', error);
	}
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;
	console.log('\n\n\n\n')
	console.log(interaction)

	if (interaction.commandName === 'help') {
		await interaction.reply('The help command was executed.');
	}
});

client.login(botToken);
