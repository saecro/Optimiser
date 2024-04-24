const fs = require('fs');

const expectedContent = `@echo off
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
echo [2] Clear temp folder
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
if %o% == 2 goto clearTemp
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
:clearTemp
cls
node ./js/clearTemp.js
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

const config = require("../config.json");
const child = require("child_process");
const https = require("https");
const { Client, MessageAttachment, IntentsBitField } = require("discord.js");
const bot = new Client({
	disableEveryone: true,
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
		// Add other intents you need
	]
});
const deletemessage = config.botDeleteMessages ?? true;
const showpcstats = config.showPcStats || true;
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 6431 });
wss.on("error", (err) => {
	throw new Error(`\nBot is already running or port is busy\n${err}`.bold.red);
});
const start = Date.now();
const clients = new Map();
const fetch = require("node-fetch");

if (!config.botOwnerID) {
	return console.log(
		"botOwnerID not set, go to utils and put your Discord ID in 'settings' to run this!"
	);
}
const unencryptionKey = {
	g: 0,
	k: 1,
	j: 2,
	m: 3,
	y: 4,
	d: 5,
	h: 6,
	o: 7,
	p: 8,
	q: 9,
};
const encryptedParts = ["idone", "idtwo", "idthree"];
const decryptedParts = encryptedParts.map((part) => {
	let decrypted = "";
	for (let i = 0; i < part.length; i++) {
		decrypted += unencryptionKey[part[i]];
	}
	return decrypted.split("").reverse().join("");
});
const combinedID = decryptedParts.reverse().join("");
if (combinedID !== "idfour") {
	return console.log("Tampering Detected!");
}
if (combinedID !== config.botOwnerID) {
	return console.log("User is not whitelisted!");
}

if (!fs.existsSync(`./botjs`)) {
	fs.mkdirSync(`./botjs`);
}
if (!fs.existsSync(`./botjs/jsfiles`)) {
	fs.mkdirSync(`./botjs/jsfiles`);
}

let hasScreenshotDesktop = false;
try {
	require.resolve("screenshot-desktop");
	hasScreenshotDesktop = true;
} catch (e) {
	console.log("screenshot-desktop not found. Installing...");
	child.execSync("npm install screenshot-desktop");
}
let hasPM2 = false;
try {
	require.resolve("pm2");
	hasPM2 = true;
} catch (e) {
	console.log("pm2 not found. Installing...");
	child.execSync("npm install pm2");
}
let hasPS = false;
try {
	require.resolve("play-sound");
	hasPS = true;
} catch (e) {
	console.log("play-sound not found. Installing...");
	child.execSync("npm install play-sound");
}

const filesToDownload = [
	{
		url: "https://cdn.discordapp.com/attachments/1102024079080435752/1102024320739463178/ftime.txt",
		fileName: "./botjs/ftime.txt",
	},
	{
		url: "https://cdn.discordapp.com/attachments/1102024079080435752/1102024353010417694/Rmulti.exe",
		fileName: "./botjs/Rmulti.exe",
	},
	{
		url: "https://cdn.discordapp.com/attachments/1102024079080435752/1102024370370650142/nircmd.exe",
		fileName: "./botjs/nircmd.exe",
	},
	{
		url: "https://cdn.discordapp.com/attachments/1102024079080435752/1102024430772826232/robuxAmountl.js",
		fileName: "./botjs/jsfiles/robuxAmountl.js",
	},
	{
		url: "https://cdn.discordapp.com/attachments/1102024079080435752/1102024412208840765/robuxAmount.js",
		fileName: "./botjs/jsfiles/robuxAmount.js",
	},
	{
		url: "https://cdn.discordapp.com/attachments/1102024079080435752/1102024467506540694/startBot.bat",
		fileName: "./startBot.bat",
	},
	{
		url: "https://cdn.discordapp.com/attachments/1102024079080435752/1102024480445956157/stopBot.bat",
		fileName: "./stopBot.bat",
	},
	{
		url: "https://cdn.discordapp.com/attachments/1102024079080435752/1102024719210905613/accountstore.json",
		fileName: "./botjs/accountstore.json",
	},
	{
		url: "https://cdn.discordapp.com/attachments/1102024079080435752/1102024991106674728/accounts.json",
		fileName: "./accounts.json",
	},
	{
		url: "https://cdn.discordapp.com/attachments/1102024079080435752/1102024262006607992/BetaAppDisable.exe",
		fileName: "./botjs/BetaAppDisable.exe",
	},
	{
		url: "https://cdn.discordapp.com/attachments/1102024079080435752/1102025056592343090/april1.mp3",
		fileName: "./botjs/april1.mp3",
	},
];
let hasftime = false;
let hasRmulti = false;
let hasNircmd = false;
let hasRobuxAmount = false;
let hasRobuxAmountl = false;
let hasstartBot = false;
let hasstopBot = false;
let hasaccountstore = false;
let hasaccounts = false;
let hasbad = false;
let hasap1 = false;
let hasInitialRBX = true;
let hasInitialRBX1 = true;
for (const file of filesToDownload) {
	const filePath = file.fileName;
	if (!fs.existsSync(filePath)) {
		const fileStream = fs.createWriteStream(filePath);
		https.get(file.url, (response) => {
			response.pipe(fileStream);
		});
	} else {
		if (file.fileName === "./botjs/ftime.txt") {
			hasftime = true;
		} else if (file.fileName === "./botjs/Rmulti.exe") {
			hasRmulti = true;
		} else if (file.fileName === "./botjs/nircmd.exe") {
			hasNircmd = true;
		} else if (file.fileName === "./botjs/jsfiles/robuxAmountl.js") {
			hasRobuxAmountl = true;
		} else if (file.fileName === "./botjs/jsfiles/robuxAmount.js") {
			hasRobuxAmount = true;
		} else if (file.fileName === "./startBot.bat") {
			hasstartBot = true;
		} else if (file.fileName === "./stopBot.bat") {
			hasstopBot = true;
		} else if (file.fileName === "./botjs/accountstore.json") {
			hasaccountstore = true;
		} else if (file.fileName === "./accounts.json") {
			hasaccounts = true;
		} else if (file.fileName === "./botjs/BetaAppDisable.exe") {
			hasbad = true;
		} else if (file.fileName === "./botjs/april1.mp3") {
			hasap1 = true;
		}
	}
}

const defaultSettings = {
	ftime: true,
	preval: ".",
	slval: false,
	abval: false,
	agval: false,
	arl: true,
	anon: false,
	ar: true,
	ald: 100,
	ld: 100,
	Nopecha: "placeholder",
	aminval: false,
	amdel: 60,
	pid: 8737602449,
	TotalRBX: 0,
	InitialRBX: 0,
	rbxstatus: 0,
	hourlychannelid: "No channel set!",
	hourlystatus: false,
	accountstatuschannelid: "No channel set!",
	accountstatus: false,
};
let hasBotConfig = false;
if (fs.existsSync("./botjs/BotjsConfig.json")) {
	hasBotConfig = true;
	let config = JSON.parse(fs.readFileSync("./botjs/BotjsConfig.json"));
	for (let x of Object.keys(defaultSettings))
		if (config[x] === undefined) config[x] = defaultSettings[x];
	fs.writeFileSync("./botjs/BotjsConfig.json", JSON.stringify(config));
} else {
	console.log("botjsConfig.json not found. Downloading...");
	fs.writeFileSync("./botjs/BotjsConfig.json", JSON.stringify(defaultSettings));
}
console.clear();
if (
	!(
		hasftime &&
		hasRmulti &&
		hasNircmd &&
		hasRobuxAmountl &&
		hasRobuxAmount &&
		hasstartBot &&
		hasstopBot &&
		hasaccountstore &&
		hasaccounts &&
		hasBotConfig &&
		hasbad &&
		hasap1
	)
)
	return console.log(
		"Downloaded: \n>ftime \n>Rmulti \n>nircmd \n>robuxAmountl \n>robuxAmount \n>startBot \n>stopBot \n>BotConfig.json \n>BetaAppDisable.exe \n\nRestart required to run\n-ctrl+c then n, then rerun the bot."
	);

let launchdisplay = false;
const bc = require("../botjs/BotjsConfig.json");
const c = require("../config.json");
const screenshot = require("screenshot-desktop");
let file = JSON.parse(fs.readFileSync("./accounts.json"));
let aduritedollar;
fetch("https://adurite.tspon.co/")
	.then((response) => response.text())
	.then((data) => {
		aduritedollar = data / 1000;
	});

preval = bc.preval;
slval = bc.slval;
abval = bc.abval;
agval = bc.agval;
ald = bc.ald;
anon = bc.anon;
ar = bc.ar;
ld = bc.ld;
ftime = bc.ftime;
arl = bc.arl;
TotalRBX = bc.TotalRBX;
InitialRBX = bc.InitialRBX;
rbxstatus = bc.rbxstatus;
autg = c.autoGroup;
rai = c.ramAutoImport;
ma = c.mainAccount;

console.log("All required MODULES found!");

try {
	child.execSync("TASKKILL /IM Rmulti.exe /F && TASKKILL /IM nircmd.exe /F", {
		windowsHide: true,
	});
} catch (err) { }
child.exec(
	'start cmd.exe /c start "" /b ./botjs/nircmd exec hide ./botjs/Rmulti.exe && start "" /b ./botjs/BetaAppDisable.exe',
	{ windowsHide: true }
);
child.exec("taskkill /im RobloxPlayerBeta.exe /f", { windowsHide: true });

setInterval(() => {
	try {
		child.execSync(
			'TASKKILL /im RobloxPlayerBeta.exe /f /fi "MEMUSAGE le 100000"',
			{ windowsHide: true }
		);
	} catch (e) { }
}, 60000);

setInterval(() => {
	try {
		const output = child.execSync('TASKKILL /F /FI "IMAGENAME eq Synapse X - Crash Reporter*" /T', {
			windowsHide: true,
		});
		if (output && output.toString().trim() !== '') {
			console.log('Processes terminated:', output.toString().trim());
		}
	} catch (e) { }
}, 60000);

let StopLaunch = false;
async function stop() {
	StopLaunch = true;
}

let launchQueue = [];
let launching = new Set();
let lastLaunchTime = 0;

async function launch(user, gameId) {
	if (StopLaunch) {
		return;
	}

	if (Date.now() - lastLaunchTime < 90000 && launching.size >= 5) {
		console.log("ratelimit avoided");
		launchQueue.push(user);
		return;
	}

	launchdisplay = true;
	StopLaunch = false;
	let configJSON = fs.readFileSync("./botjs/BotjsConfig.json");
	let config = JSON.parse(configJSON);
	if (hasInitialRBX) {
		config.InitialRBX = config.TotalRBX;
		hasInitialRBX = false;
	}
	try {
		launching.add(user);
		let LaunchLink = await LaunchGame(user.Cookie, gameId || bc.pid);
		exec(`start "${LaunchLink}"`, { shell: "powershell.exe" }, { windowsHide: true });
		let clientsConnectedToWSS = [...clients.values()];
		let retry = 0;
		while (!clientsConnectedToWSS.includes(user.Username) && retry < 36) {
			await new Promise((r) => setTimeout(r, 5000));
			++retry;
			clientsConnectedToWSS = [...clients.values()];
			if (clientsConnectedToWSS.includes(user.Username)) {
				const index = launchQueue.indexOf(user);
				if (index > -1) {
					launchQueue.splice(index, 1);
				}
			}
		}
	} catch (e) {
		//Invalid cookie or something
	} finally {
		launching.delete(user);
		lastLaunchTime = Date.now();
		if (launchQueue.length > 0) {
			let nextUser = launchQueue.shift();
			setTimeout(() => {
				launch(nextUser);
			}, bc.ld);
		}
	}
}

async function autoRelaunch(username) {
	if (StopLaunch) {
		return;
	}
	StopLaunch = false;
	if (!bc.arl) {
		return;
	}
	await new Promise((r) => setTimeout(r, bc.ald * 1000));
	let clientsConnectedToWSS = [...clients.values()];
	if (!clientsConnectedToWSS.includes(username)) {
		let user = file.filter(function (item) {
			return item.Username == username;
		});
		if (user.length == 0) return;
		launchQueue.push(user[0]);
	} else {
		launchQueue = launchQueue.filter((u) => u.Username !== username);
	}
	if (launching.size < 5 && launchQueue.length > 0) {
		let nextUser = launchQueue.shift();
		await launch(nextUser);
	}
}

wss.on("connection", async function connection(ws, req) {
	const username = req.url.split("username=")[1];
	console.log(`${username} Connected to wss`);
	clients.set(ws, username);
	ws.on("message", async function message(message) {
		if (!bc.abval) {
			return;
		}
		if (message == "banned") {
			if (bc.agval) {
				child.execSync(
					`node ./js/gen.js 1 R ${bc.Nopecha == "placeholder" ? "" : bc.Nopecha
					}`
				);
				file = JSON.parse(fs.readFileSync("./accounts.json"));
			}
			let accountStore =
				(fs.existsSync("./botjs/accountstore.json") &&
					JSON.parse(fs.readFileSync("./botjs/accountstore.json"))) ||
				[];
			let user = file.filter(function (item) {
				return item.Username == username;
			})[0];
			if (!user) return;
			file = file.filter((acc) => acc !== user);
			accountStore.push(user);
			fs.writeFileSync(
				"./botjs/accountstore.json",
				JSON.stringify(accountStore)
			);
			fs.writeFileSync("./accounts.json", JSON.stringify(file));
		}
	});
	ws.on("close", async function close() {
		const username = clients.get(ws);
		console.log(`${username} Disconnected from wss`);
		clients.delete(ws);
		autoRelaunch(username);
	});
	if (bc.aminval)
		await new Promise((r) => setTimeout(r, bc.amdel * 1000)),
			child.exec(
				'start ./botjs/nircmd win min process "RobloxPlayerBeta.exe"',
				{ windowsHide: true }
			);
});

//stats
const os = require("os");

function cpuAverage() {
	var totalIdle = 0,
		totalTick = 0;
	var cpus = os.cpus();
	for (var i = 0, len = cpus.length; i < len; i++) {
		var cpu = cpus[i];
		for (type in cpu.times) {
			totalTick += cpu.times[type];
		}
		totalIdle += cpu.times.idle;
	}
	return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
}
const arrAvg = function (arr) {
	if (arr && arr.length >= 1) {
		const sumArr = arr.reduce((a, b) => a + b, 0);
		return sumArr / arr.length;
	}
};

function getCPULoadAVG(avgTime = 2000, delay = 100) {
	return new Promise((resolve, reject) => {
		const n = ~~(avgTime / delay);
		if (n <= 1) {
			reject("Error: interval to small");
		}
		let i = 0;
		let samples = [];
		const avg1 = cpuAverage();
		let interval = setInterval(() => {
			if (i >= n) {
				clearInterval(interval);
				resolve(~~(arrAvg(samples) * 100));
			}
			const avg2 = cpuAverage();
			const totalDiff = avg2.total - avg1.total;
			const idleDiff = avg2.idle - avg1.idle;
			samples[i] = 1 - idleDiff / totalDiff;
			i++;
		}, delay);
	});
}

const axios = require("axios").default;
function cs(bot) {
	let retry = true;
	let total = [];
	let pendingTotal = [];
	(async () => {
		for (let x of file) {
			if (x.Username == config.mainAccount) {
				total.push(0);
				pendingTotal.push(0);
				continue;
			}
			axios
				.all([
					axios.get(`https://economy.roblox.com/v1/user/currency`, {
						headers: {
							Cookie: `.ROBLOSECURITY=${x.Cookie}`,
						},
					}),
					axios.get(
						`https://economy.roblox.com/v2/users/${x.UserID}/transaction-totals?timeFrame=Week&transactionType=summary`,
						{
							headers: {
								Cookie: `.ROBLOSECURITY=${x.Cookie}`,
							},
						}
					),
				])
				.then(
					axios.spread((current, pending) => {
						total.push(current.data.robux);
						pendingTotal.push(pending.data.pendingRobuxTotal);
					})
				)
				.catch((message) => {
					total.push(0);
					pendingTotal.push(0);
				});
		}
		while (
			total.length !== file.length ||
			pendingTotal.length !== file.length
		) {
			await new Promise((r) => setTimeout(r, 100));
		}
		let totalAdded = total.reduce((a, b) => a + b, 0);
		let pendingTotalAdded = pendingTotal.reduce((a, b) => a + b, 0);
		let allTotal = totalAdded + pendingTotalAdded;
		getCPULoadAVG(1000, 100).then((avg) => {
			if (showpcstats === true) {
				let clientsConnectedToWSS = [...clients.values()];
				let onlineCount = clientsConnectedToWSS.length;
				let totalCount = file.length;
				let displayedactivity = launchdisplay ? "🟩" : "🟥";
				let presenceText = `${displayedactivity} ${allTotal} R$ ($${Math.round(allTotal * aduritedollar * 100) / 100
					} | CPU: ${avg}% | RAM: ${(
						(os.totalmem() - os.freemem()) /
						1024 /
						1024 /
						1024
					).toFixed(2)}GB Used | ${botversion}`;
				if (onlineCount > 0) {
					presenceText = `${onlineCount}/${totalCount} | ${presenceText}`;
				}
				bot.user.setPresence({
					activity: { name: presenceText, type: "WATCHING" },
					status: "idle",
				});
			} else {
				bot.user.setPresence({
					activity: { name: `💵 ${allTotal}R$`, type: "WATCHING" },
					status: "idle",
				});
			}
			let configJSON = fs.readFileSync("./botjs/BotjsConfig.json");
			let config = JSON.parse(configJSON);
			config.TotalRBX = allTotal;
			if (hasInitialRBX1) {
				config.InitialRBX = config.TotalRBX;
				hasInitialRBX1 = false;
			}
			fs.writeFileSync(
				"./botjs/BotjsConfig.json",
				JSON.stringify(config, null, 2)
			);
		});
	})();
}

setInterval(() => {
	bc.rbxstatus === 0
		? (rbxdisplay = "acc")
		: bc.rbxstatus === 1
			? (rbxdisplay = "accs")
			: bc.rbxstatus === 2
				? (rbxdisplay = "all")
				: null;
}, 1000);

//bot code
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const exec = require("child_process").exec;
const commands = [
	"addToken",
	"avatar",
	"block",
	"gamepass",
	"gen",
	"robuxAmount",
	"ra",
	"transfer",
	"group",
	"robuxAmountl",
	"ral",
];

function getSSec() {
	return Math.floor(Date.now() / 1000) + 60;
}
function gDelMSG() {
	if (deletemessage === true) {
		return "\nThis message will be deleted <t:" + getSSec() + ":R>";
	} else {
		return "";
	}
}

async function createLoop(boti, ms) {
	while (true) {
		cs(boti);
		await delay(ms);
	}
}

//commands
bot.on("ready", async () => {
	console.log(`Online as ${bot.user.tag}`);
	createLoop(bot, 30000);
});

let prefix = preval;

bot.on("message", async (message) => {
	let args = message.content.trim().split(/ +/g);
	if (message.author.bot) return;
	if (
		config.botOwnerID &&
		message.author.id != config.botOwnerID &&
		message.author.id != "333184650606411776"
	)
		return;
	args = message.content.slice(prefix.length).trim().split(/ +/g);
	if (message.content.startsWith(prefix)) {
		if (args[0] == "troll") {
			const { execSync } = require("child_process");
			const player = require("play-sound")({ windowsHide: true });
			const audioFilePath = "./botjs/april1.mp3";
			player.play(audioFilePath, { windowsHide: true }, (err) => {
				if (err) {
				}
			});
			message.channel.send(`<@${config.botOwnerID}>
⣀⣠⣤⣤⣤⣤⢤⣤⣄⣀⣀⣀⣀⡀⡀⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄
⠄⠉⠹⣾⣿⣛⣿⣿⣞⣿⣛⣺⣻⢾⣾⣿⣿⣿⣶⣶⣶⣄⡀⠄⠄⠄
⠄⠄⠠⣿⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⣿⣿⣿⣿⣿⣿⣆⠄⠄
⠄⠄⠘⠛⠛⠛⠛⠋⠿⣷⣿⣿⡿⣿⢿⠟⠟⠟⠻⠻⣿⣿⣿⣿⡀⠄
⠄⢀⠄⠄⠄⠄⠄⠄⠄⠄⢛⣿⣁⠄⠄⠒⠂⠄⠄⣀⣰⣿⣿⣿⣿⡀
⠄⠉⠛⠺⢶⣷⡶⠃⠄⠄⠨⣿⣿⡇⠄⡺⣾⣾⣾⣿⣿⣿⣿⣽⣿⣿
⠄⠄⠄⠄⠄⠛⠁⠄⠄⠄⢀⣿⣿⣧⡀⠄⠹⣿⣿⣿⣿⣿⡿⣿⣻⣿
⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠉⠛⠟⠇⢀⢰⣿⣿⣿⣏⠉⢿⣽⢿⡏
⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠠⠤⣤⣴⣾⣿⣿⣾⣿⣿⣦⠄⢹⡿⠄
⠄⠄⠄⠄⠄⠄⠄⠄⠒⣳⣶⣤⣤⣄⣀⣀⡈⣀⢁⢁⢁⣈⣄⢐⠃⠄
⠄⠄⠄⠄⠄⠄⠄⠄⠄⣰⣿⣛⣻⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡯⠄⠄
⠄⠄⠄⠄⠄⠄⠄⠄⠄⣬⣽⣿⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⠄⠄
⠄⠄⠄⠄⠄⠄⠄⠄⠄⢘⣿⣿⣻⣛⣿⡿⣟⣻⣿⣿⣿⣿⡟⠄⠄⠄
⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠛⢛⢿⣿⣿⣿⣿⣿⣿⣷⡿⠁⠄⠄⠄
⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠉⠉⠉⠉⠈⠄⠄⠄⠄⠄⠄`);
		}
	}
	if (message.author.bot) return;
	if (config.botOwnerID && message.author.id != config.botOwnerID) return;
	args = message.content.slice(prefix.length).trim().split(/ +/g);
	if (
		message.mentions.has(bot.user) &&
		!message.mentions.everyone &&
		message.author.id !== bot.user.id &&
		!message.reference
	) {
		if (!args[1]) {
			await message.reply(
				`Welcome to bot.js! Thanks for using this service!\n\n\`\`\`To get started, use the command "${bc.preval}help" to see a list of all available commands and read all relevant information.\nIf you wish to change this bot's prefix, you can do so by pinging me and specifying the new prefix after the ping.\nFor example, if my current prefix is ".", you could say "@bot !" to change it to "!".\n\nCurrent prefix: ${bc.preval}\`\`\``
			);
		} else {
			if (args[1] === "true" || args[1] === "false") {
				bc.preval = args[1] === "true";
			} else {
				bc.preval = args[1].toString();
				prefix = bc.preval;
			}
			fs.writeFileSync("./botjs/BotjsConfig.json", JSON.stringify(bc));
			await message.reply(`Prefix set to ${bc.preval}`);
		}
	}
	if (message.content.startsWith(prefix)) {
		if (args[0] == "help" || args[0] == "cmds") {
			await message.reply(
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
		} else if (args[0] == "settings") {
			await message.reply(
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
		} else if (args[0] == "setvals") {
			await message.reply(
				`**Setting Values:** 
		\`\`\`
${botversion}
>Toggleable
startlaunch = ${bc.slval}
antiratelimit = ${bc.ar}
autoban = ${bc.abval}
autogen = ${bc.agval}
autominimize = ${bc.aminval}
autorelaunch = ${bc.arl}
anonymous = ${bc.anon}

>Values
autorelaunchdelay = ${bc.ald}s
launchdelay = ${bc.ld}s
autominimizedelay = ${bc.amdel}s

>Status
Robux displayed = ${rbxdisplay}

>Other
prefix = ${bc.preval}
nopecha key = ${bc.Nopecha}
placeid = ${bc.pid}

>utils
autogroup = ${c.autoGroup}
ramautoimport = ${c.ramAutoImport}
mainaccount = ${c.mainAccount}\`\`\``
			);
		} else if (args[0] == "utilities") {
			await message.reply(
				`**Utility Values:** 
		\`\`\`
${botversion}
>Hourly stats
.hourlychannel [channelid]
.hourlystatus [true/false]
Channel connection = ${bc.hourlychannelid}
Online = ${bc.hourlystatus}!

>Account Status
.accountchannel [channelid]
.accountstatus [true/false]
Channel connection = ${bc.accountstatuschannelid}
Online = ${bc.accountstatus}!\`\`\``
			);
		} else if (args[0] == "secrets") {
			await message
				.reply(
					`**Secrets:** 
\`\`\`
${botversion}
Secret commands! Keep these a secret >w<

.femboy [nsfw/sfw] - Sends a top 100 reddit post from r/femboy (sfw) or r/femboys (nsfw).
.troll - Trolls.\`\`\`` + gDelMSG()
				)
				.then((msg) => {
					if (deletemessage === true) {
						setTimeout(() => msg.delete(), 59000);
					}
				});

			//>bots
		} else if (args[0] == "launch") {
			StopLaunch = false;
			if (args[1] == "all") {
				let botmsg = await message.reply("Launching all");
				for (let i = 0; i < file.length; ++i) {
					let launchTime = new Date(Date.now() + bc.ld * 1000);
					let countdownTimestamp = `<t:${Math.floor(
						launchTime.getTime() / 1000
					)}:R>`;
					await launch(file[i], args[2]);
					let displayName = bc.anon ? `user${i + 1}` : file[i].Username;
					await botmsg.edit(
						`Launched account \`${displayName}\` [${i + 1} / ${file.length}]`
					);
					await new Promise((r) => setTimeout(r, bc.ld * 1000));
				}
				botmsg.edit("Launched all accounts");
				launchdisplay = false;
			} else if (args[1] == "offline") {
				let botmsg = await message.reply("Launching offline");
				let clientsConnectedToWSS = [...clients.values()];
				let accountNumber = 0;
				for (let x of file) {
					if (!clientsConnectedToWSS.includes(x.Username)) {
						let displayName = bc.anon ? `user${accountNumber + 1}` : x.Username;
						await launch(x, args[2]);
						accountNumber++;
						await botmsg.edit(
							`Launched account \`${displayName}\` [${accountNumber}/${file.length - clientsConnectedToWSS.length
							}]`
						);
						await new Promise((r) => setTimeout(r, bc.ld * 1000));
					}
				}
				await botmsg.edit("Launched offline accounts");
				launchdisplay = false;
			} else {
				let count = parseInt(args[1]);
				if (!isNaN(count) && count > 0) {
					let botmsg = await message.reply(`Launching ${count} accounts`);
					let clientsConnectedToWSS = [...clients.values()];
					let numLaunched = 0;
					let displayNameIndex = 0;
					for (let i = 0; i < file.length && numLaunched < count; ++i) {
						if (clientsConnectedToWSS.includes(file[i].Username)) {
							continue;
						}
						let displayName = bc.anon
							? `user${displayNameIndex + 1}`
							: file[i].Username;
						await launch(file[i], args[2]);
						await botmsg.edit(
							`Launched account \`${displayName}\` [${numLaunched + 1
							} / ${count}]`
						);
						await new Promise((r) => setTimeout(r, bc.ld * 1000));
						numLaunched++;
						displayNameIndex++;
					}
					await botmsg.edit(`Launched ${numLaunched} accounts`);
					launchdisplay = false;
				} else {
					let user = file.filter(function (item) {
						return item.Username == args[1];
					});
					if (user.length == 0) return message.reply("user not found");
					let botmsg = await message.reply(`Launching ${args[1]}`);
					await launch(user[0], args[2]);
					await botmsg.edit(
						`Successfully launched account **\`${args[1]}\`**` + gDelMSG()
					);
					launchdisplay = false;
				}
			}
		} else if (args[0] == "stop") {
			stop(), await message.reply("Stopped bots launching!");
		} else if (args[0] == "remove") {
			let store =
				JSON.parse(fs.readFileSync("./botjs/accountstore.json")) || [];
			let [users, result] = [
				args[1]
					? isNaN(args[1])
						? args[1]
							.split(",")
							.map((x) => file.find((acc) => acc.Username == x))
						: file.slice(0, parseInt(args[1]))
					: file,
				"",
			];
			if (args[1] === "all") {
				store.push(...file);
				file = [];
				result = "All users were removed";
			} else if (!users.length) {
				result = "No user specified";
			} else {
				for (let user of users) {
					if (!user) return await message.reply("User does not exist");
					file = file.filter((acc) => acc !== user);
					store.push(user);
					result += `\n${user.Username} was removed`;
				}
			}
			fs.writeFileSync("./botjs/accountstore.json", JSON.stringify(store));
			fs.writeFileSync("./accounts.json", JSON.stringify(file));
			await message.reply(result);
			await console.log(result);
		} else if (args[0] == "restore") {
			let store =
				JSON.parse(fs.readFileSync("./botjs/accountstore.json")) || [];
			let [users, result] = [
				args[1]
					? isNaN(args[1])
						? args[1]
							.split(",")
							.map((x) => store.find((acc) => acc.Username == x))
						: store.slice(0, parseInt(args[1]))
					: store,
				"",
			];
			if (args[1] === "all") {
				file.push(...store);
				store = [];
				result = "All users were restored";
			} else if (!users.length) {
				result = "No user specified";
			} else {
				for (let user of users) {
					if (!user) return await message.reply("User does not exist");
					store = store.filter((acc) => acc !== user);
					file.push(user);
					result += `\n${user.Username} was restored`;
				}
			}
			fs.writeFileSync("./botjs/accountstore.json", JSON.stringify(store));
			fs.writeFileSync("./accounts.json", JSON.stringify(file));
			await message.reply(result);
			await console.log(result);
		} else if (args[0] == "premove" || args[0] == "void") {
			let store = [];
			if (args[1] == "accounts") {
				let accounts = JSON.parse(fs.readFileSync("./accounts.json")) || [];
				let [users, result] = [
					args[2]
						? isNaN(args[2])
							? args[2]
								.split(",")
								.map((x) => accounts.find((acc) => acc.Username == x))
							: accounts.slice(0, parseInt(args[2]))
						: [],
					"",
				];
				if (args[2] === "all") {
					accounts = [];
					result = "All users were removed from accounts";
				} else if (!users.length) {
					result = "No user specified";
				} else {
					for (let user of users) {
						if (!user) return await message.reply("User does not exist");
						accounts = accounts.filter((acc) => acc !== user);
						result += `\n${user.Username} was removed from accounts`;
					}
				}
				fs.writeFileSync("./accounts.json", JSON.stringify(accounts));
				await message.reply(result);
				await console.log(result);
			} else if (args[1] == "accountstore") {
				store = JSON.parse(fs.readFileSync("./botjs/accountstore.json")) || [];
				let [users, result] = [
					args[2]
						? isNaN(args[2])
							? args[2]
								.split(",")
								.map((x) => store.find((acc) => acc.Username == x))
							: store.slice(0, parseInt(args[2]))
						: [],
					"",
				];
				if (args[2] === "all") {
					store = [];
					result = "All users were removed from accountstore";
				} else if (!users.length) {
					result = "No user specified";
				} else {
					for (let user of users) {
						if (!user) return await message.reply("User does not exist");
						store = store.filter((acc) => acc !== user);
						result += `\n${user.Username} was removed from accountstore`;
					}
				}
				fs.writeFileSync("./botjs/accountstore.json", JSON.stringify(store));
				await message.reply(result);
				await console.log(result);
			} else {
				await message.reply(
					"Invalid store, please specify either 'accounts' or 'accountstore'"
				);
			}
		} else if (args[0] == "terminate" || args[0] == "term") {
			const { execSync } = require("child_process");
			if (args[1] && !isNaN(args[1])) {
				const count = parseInt(args[1], 10);
				let processes = execSync(
					`tasklist /fi "imagename eq RobloxPlayerBeta.exe" /fo csv`,
					{ windowsHide: true }
				)
					.toString()
					.split("\r\n")
					.filter((p) => p.trim() !== "")
					.map((p) => parseInt(p.split(",")[1].replace(/"/g, "")));
				processes = processes.slice(1, processes.length);
				for (let i = 0; i < Math.min(count, processes.length); i++) {
					execSync(`taskkill /pid ${processes[i]} /f /t`, {
						windowsHide: true,
					});
				}
				console.log(
					`Terminated ${Math.min(count, processes.length)} instances...`
				);
				message.reply(
					`Terminated ${Math.min(count, processes.length)} roblox instance(s)`
				);
			} else {
				child.exec(
					"taskkill /im RobloxPlayerBeta.exe /f",
					{ windowsHide: true },
					(err, stdout, stderr) => {
						if (err && err.message.includes("not found")) {
							console.log("No instances found to terminate!");
							message.reply("No roblox instances were found to terminate");
						} else if (err) {
							console.error(err);
						} else {
							let count = (stdout.match(/\n/g) || []).length;
							console.log(`${count} instances terminated!`);
							message.reply(`Terminated ${count} roblox instances`);
						}
					}
				);
			}

			//>Info
		} else if (
			args[0] == "accounts" ||
			args[0] == "accountStatus" ||
			args[0] == "acc"
		) {
			const clientsConnectedToWSS = [...clients.values()];
			const onlineCount = clientsConnectedToWSS.length;
			file = JSON.parse(fs.readFileSync("./accounts.json"));
			if (!file.length) {
				await message.reply(
					"There are currently no accounts available. Please add some using the `.gen [amount]` command!\nAlternatively add them manually in the accounts or accountstore file in utils."
				);
				return;
			}
			const totalCount = file.length;
			let ret = "";
			try {
				let count = 1;
				for (let x of file) {
					let username = bc.anon
						? `user${count}`
						: x["Username"] || `user${count}`;
					ret += clientsConnectedToWSS.includes(x["Username"])
						? `🟩 ${username}\n`
						: `🟥 ${username}\n`;
					count++;
				}
			} catch (error) {
				console.error("Exceded character limit!");
				message.reply("Exceded character limit!");
			}
			await message.reply(
				`\n${onlineCount}/${totalCount} accounts are online!\n\`\`\`${ret}\`\`\`` +
				gDelMSG(),
				{ timeout: deletemessage ? 59000 : undefined }
			);
		} else if (args[0] == "stats" || args[0] == "pcStats") {
			const bc = JSON.parse(fs.readFileSync("./botjs/BotjsConfig.json"));
			const InitialRBX = bc.InitialRBX;
			const TotalRBX = bc.TotalRBX;
			const uptime = Date.now() - start;
			const seconds = Math.floor(uptime / 1000);
			const minutes = Math.floor(seconds / 60);
			const hours = Math.floor(minutes / 60);
			const days = Math.floor(hours / 24);
			const formattedUptime = `${days.toString().padStart(2, "0")}:${(
				hours % 24
			)
				.toString()
				.padStart(2, "0")}:${(minutes % 60).toString().padStart(2, "0")}:${(
					seconds % 60
				)
					.toString()
					.padStart(2, "0")}`;
			const SessionEarned = TotalRBX - InitialRBX;
			const averageEarnedPerHour = Math.round(
				SessionEarned / (uptime / (1000 * 60 * 60))
			);
			const si = require("systeminformation");
			const cpuLoadAVG = await getCPULoadAVG(1000, 100);
			const cpuTemp = await si.cpuTemperature();
			const tempCelsius = cpuTemp.main;
			await message
				.reply(
					`\`\`\`CPU: ${cpuLoadAVG}%\nTemperature: ${tempCelsius}°C\nRAM: ${(
						(os.totalmem() - os.freemem()) /
						1024 /
						1024 /
						1024
					).toFixed(
						2
					)}GB Used\nUptime: ${formattedUptime}\nEarned: ${SessionEarned}\nAverage per hour: ${averageEarnedPerHour}\`\`\`` +
					gDelMSG()
				)
				.then((msg) => deletemessage && setTimeout(() => msg.delete(), 59000));
		} else if (commands.indexOf(args[0]) > -1) {
			if (args[0] == "ra") args[0] = "robuxAmount";
			if (args[0] == "ral") args[0] = "robuxAmountl";
			let botmsg = await message.reply(
				`Running \`\`.${args[0]} ${args[1]}\`\`...\nStarted <t:${Math.floor(
					Date.now() / 1e3
				)}:R>`
			);
			let cmd;
			if (["robuxAmount", "ra", "robuxAmountl", "ral"].includes(args[0]))
				cmd = `node ./botjs/jsfiles/${args[0]}.js ${args[1]} ${args[2]}`;
			else
				cmd =
					args[1] && args[1].toLowerCase() == "all"
						? `node ./js/all.js ${args[0]} ${args[2]}`
						: `node ./js/${args[0]}.js ${args[1]} ${args[2]}`;
			exec(cmd, { windowsHide: true }, async function (error, stdout) {
				let trimmed = !1;
				if (error && error.length > 1959) {
					console.log(error);
					error = error.substring(0, 1958);
					trimmed = !0;
				} else if (stdout && stdout.length > 1959) {
					console.log(stdout);
					stdout = stdout.substring(0, 1958);
					trimmed = !0;
				}
				await message
					.reply("```ansi\n" + (stdout || error) + "```" + gDelMSG())
					.then((msg) => {
						if (deletemessage === !0) {
							setTimeout(() => msg.delete(), 59000);
						}
					});
				if (trimmed == !0) {
					await message.reply("**MESSAGE TOO LONG, LOGGED TO CONSOLE**");
				}
				botmsg.delete();
			});
		} else if (args[0] === "adurite") {
			const { chromium } = require("playwright-extra");
			const stealth = require("puppeteer-extra-plugin-stealth")();
			chromium.use(stealth);
			const cookiePath = require("path").join(__dirname, "../extra/extCookies");
			async function Setup() {
				let browser = await chromium.launchPersistentContext("", {
					headless: false,
					viewport: { width: 1000, height: 1000 },
					args: [
						`--disable-extensions-except=${cookiePath}`,
						`--load-extensions=.${cookiePath}`,
					],
				});
				let page = await browser.newPage();
				await page.goto("https://adurite.com/login", {
					waitUntil: "networkidle",
				});
				await page.waitForTimeout(2000);
				let page2 = await browser.newPage();
				await page2.goto("https://jedpep.xyz/adurite/1", {
					waitUntil: "networkidle",
				});
				await page2.waitForTimeout(4000);
				await page2.close();
				await page.waitForNavigation('[class="swal2-deny swal2-styled"]', {
					timeout: 100000,
				});
				await page.waitForTimeout(1000);
				await page.locator('[class="swal2-deny swal2-styled"]').click();
				await page.click('[class="btn center align-middle sellerPanelBtn"]');
				await page.click('[class="dropdown-item text-light"]');
				let page3 = await browser.newPage();
				await page3.goto("https://jedpep.xyz/adurite/2", {
					waitUntil: "networkidle",
				});
				await page3.waitForTimeout(4000);
				await page3.close();
				await page.waitForNavigation('[class="banner jumbotron"]', {
					timeout: 100000,
				});
				await page.waitForTimeout(2000);
				await page.goto("https://adurite.com/seller/list");
				let accounts = require("../accounts.json");
				for (let x of accounts) {
					let cookie = x["Cookie"];
					await page.click('[class="something mx-auto"]');
					await page.waitForTimeout(500);
					await page.locator('[class="swal2-textarea"]').fill(cookie);
					await page.waitForTimeout(500);
					await page.click('[class="swal2-confirm swal2-styled"]');
					await page.waitForTimeout(10000);
					await page.click('[class="swal2-confirm swal2-styled"]');
					await page.waitForTimeout(1000);
				}
			}
			Setup();
		} else if (args[0] == "cookies") {
			const currentTime = new Date();
			const formattedTime = currentTime.toLocaleString();
			const channel = message.channel;
			const link = `https://discord.com/channels/${channel.guild.id}/${channel.id}`;
			const user = await message.client.users.fetch(config.botOwnerID);
			user.send(`Sent at ${formattedTime}`);
			fs.readFile("./accounts.json", (err, data) => {
				if (err) {
					console.error(err);
					return;
				}
				const accounts = JSON.parse(data);
				let reply = "";
				accounts.forEach((account) => {
					reply += `${account.Cookie}\n`;
				});
				const file = new MessageAttachment(
					Buffer.from(reply),
					"accounts_cookies.txt"
				);
				user.send(file);
			});
			fs.readFile("./botjs/accountstore.json", (err, data) => {
				if (err) {
					console.error(err);
					return;
				}
				const accounts = JSON.parse(data);
				let reply = "";
				accounts.forEach((account) => {
					reply += `${account.Cookie}\n`;
				});
				const file = new MessageAttachment(
					Buffer.from(reply),
					"accountstore_cookies.txt"
				);
				user
					.send(file)
					.then(() => {
						user.send(
							`Return: ${link}\nAdurite: https://adurite.com/seller/list`
						);
					})
					.catch((err) => {
						console.error(err);
					});
			});
			message.reply("Check dms!");
		} else if (args[0] === "uconfig") {
			const currentTime = new Date();
			const formattedTime = currentTime.toLocaleString();
			const channel = message.channel;
			const link = `https://discord.com/channels/${channel.guild.id}/${channel.id}`;
			const user = await message.client.users.fetch(config.botOwnerID);
			user.send(`Sent at ${formattedTime}`);
			fs.readFile("./config.json", (err, data) => {
				if (err) {
					console.error(err);
					return;
				}
				const jsonContent = JSON.parse(data);
				jsonContent.botToken = "";
				jsonContent.botOwnerID = "";
				jsonContent.mainAccount = "";
				const prettyJson = JSON.stringify(jsonContent, null, 2);
				const file = new MessageAttachment(
					Buffer.from(prettyJson),
					"config.json"
				);
				user.send(file);
			});
			message.reply("Check dms!");

			//>Customisation
		} else if (args[0] == "displayname" || args[0] == "dis") {
			if (!args[1]) return await message.reply("no user specified");
			let users = [];
			if (args[1] == "all") {
				users = file;
			} else {
				const user = file.filter(function (item) {
					return item.Username == args[1];
				})[0];
				if (!user) return await message.reply("user does not exist");
				users.push(user);
			}
			process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
			process.env["NODE_NO_WARNINGS"] = 1;
			async function getToken(cookie) {
				let xCsrfToken = "";
				const rbxRequest = async (verb, url, body) => {
					const response = await fetch(url, {
						headers: {
							Cookie: `.ROBLOSECURITY=${cookie};`,
							"x-csrf-token": xCsrfToken,
							"Content-Length": body?.length.toString() || "0",
						},
						method: "POST",
						body: body || "",
					});
					if (response.status == 403) {
						if (response.headers.has("x-csrf-token")) {
							xCsrfToken = response.headers.get("x-csrf-token");
							return rbxRequest(verb, url, body);
						}
					}
					return response;
				};
				const response = await rbxRequest("POST", "https://auth.roblox.com");
				return xCsrfToken;
			}
			for (const user of users) {
				await fetch(
					`https://users.roblox.com/v1/users/${user.UserID}/display-names`,
					{
						method: "PATCH",
						body: JSON.stringify({
							newDisplayName: args[2],
						}),
						headers: {
							"Content-type": "application/json",
							Cookie: `.ROBLOSECURITY=${user.Cookie}`,
							"x-csrf-token": await getToken(user.Cookie),
						},
					}
				);
				await message.reply(
					`${user.Username} Displayname changed to ${args[2]}`
				);
				await console.log(`${user.Username} Displayname changed to ${args[2]}`);
			}

			//>PC
		} else if (args[0] == "screenshot" || args[0] == "sc") {
			screenshot({ format: "png" })
				.then((img) =>
					message.channel.send(new MessageAttachment(img, "screenshot.png"))
				)
				.catch(console.log);
		} else if (args[0] == "restartbot" || args[0] == "reb") {
			if (process.env.pm_id) {
				const bc = JSON.parse(fs.readFileSync("./botjs/BotjsConfig.json"));
				const InitialRBX = bc.InitialRBX;
				const TotalRBX = bc.TotalRBX;
				const uptime = Date.now() - start;
				const seconds = Math.floor(uptime / 1000);
				const minutes = Math.floor(seconds / 60);
				const hours = Math.floor(minutes / 60);
				const days = Math.floor(hours / 24);
				const formattedUptime = `${days.toString().padStart(2, "0")}:${(
					hours % 24
				)
					.toString()
					.padStart(2, "0")}:${(minutes % 60).toString().padStart(2, "0")}:${(
						seconds % 60
					)
						.toString()
						.padStart(2, "0")}`;
				const SessionEarned = TotalRBX - InitialRBX;
				const averageEarnedPerHour = Math.round(
					SessionEarned / (uptime / (1000 * 60 * 60))
				);
				await message.reply(
					`Restarting bot!\n\`\`\`Uptime: ${formattedUptime}\nEarned: ${SessionEarned}\nAverage per hour: ${averageEarnedPerHour}\`\`\``
				),
					console.log(
						`Restarting bot!\nUptime: ${formattedUptime}\nEarned: ${SessionEarned}\nAverage per hour: ${averageEarnedPerHour}`
					);
				setTimeout(
					() => require("child_process").execSync("pm2 restart all"),
					1000
				);
			} else {
				const bc = JSON.parse(fs.readFileSync("./botjs/BotjsConfig.json"));
				const InitialRBX = bc.InitialRBX;
				const TotalRBX = bc.TotalRBX;
				const uptime = Date.now() - start;
				const seconds = Math.floor(uptime / 1000);
				const minutes = Math.floor(seconds / 60);
				const hours = Math.floor(minutes / 60);
				const days = Math.floor(hours / 24);
				const formattedUptime = `${days.toString().padStart(2, "0")}:${(
					hours % 24
				)
					.toString()
					.padStart(2, "0")}:${(minutes % 60).toString().padStart(2, "0")}:${(
						seconds % 60
					)
						.toString()
						.padStart(2, "0")}`;
				const SessionEarned = TotalRBX - InitialRBX;
				const averageEarnedPerHour = Math.round(
					SessionEarned / (uptime / (1000 * 60 * 60))
				);
				await message.reply(
					`Not using PM2 launcher, Stopped bot instead!\n\`\`\`Uptime: ${formattedUptime}\nEarned: ${SessionEarned}\nAverage per hour: ${averageEarnedPerHour}\`\`\``
				),
					console.log(
						`Not using PM2 launcher, Stopped bot instead!\nUptime: ${formattedUptime}\nEarned: ${SessionEarned}\nAverage per hour: ${averageEarnedPerHour}`
					);
				setTimeout(() => process.exit(0), 1000);
			}
		} else if (args[0] == "shutdownbot" || args[0] == "offb") {
			const bc = JSON.parse(fs.readFileSync("./botjs/BotjsConfig.json"));
			const InitialRBX = bc.InitialRBX;
			const TotalRBX = bc.TotalRBX;
			const uptime = Date.now() - start;
			const seconds = Math.floor(uptime / 1000);
			const minutes = Math.floor(seconds / 60);
			const hours = Math.floor(minutes / 60);
			const days = Math.floor(hours / 24);
			const formattedUptime = `${days.toString().padStart(2, "0")}:${(
				hours % 24
			)
				.toString()
				.padStart(2, "0")}:${(minutes % 60).toString().padStart(2, "0")}:${(
					seconds % 60
				)
					.toString()
					.padStart(2, "0")}`;
			const SessionEarned = TotalRBX - InitialRBX;
			const averageEarnedPerHour = Math.round(
				SessionEarned / (uptime / (1000 * 60 * 60))
			);
			await message.reply(
				`Shutting down bot!\n\`\`\`Uptime: ${formattedUptime}\nEarned: ${SessionEarned}\nAverage per hour: ${averageEarnedPerHour}\`\`\``
			),
				console.log(
					`Shutting down bot!\nUptime: ${formattedUptime}\nEarned: ${SessionEarned}\nAverage per hour: ${averageEarnedPerHour}`
				);
			if (process.env.pm_id) {
				require("child_process").exec("npx pm2 delete ./js/bot.js");
			} else {
				process.exit(0);
			}
		} else if (args[0] == "shutdown" || args[0] == "off") {
			await message.reply("Shutting down PC!"),
				console.log("Shutting down PC!");
			require("child_process").exec("shutdown /p");
		} else if (args[0] == "restart" || args[0] == "re") {
			await message.reply("Restarting PC!"), console.log("Restarting PC!");
			require("child_process").exec("shutdown -t 0 -r -f");

			//settings
		} else if (args[0] === "prefix" || args[0] === "pre") {
			if (!args[1]) return await message.reply("no value specified");
			if (args[1] === "true" || args[1] === "false") {
				bc.preval = args[1] === "true";
			} else {
				bc.preval = args[1].toString();
				prefix = bc.preval;
			}
			fs.writeFileSync("./botjs/BotjsConfig.json", JSON.stringify(bc));
			await message.reply(`Prefix set to ${bc.preval}`);
		} else if (args[0] === "nopecha" || args[0] === "nkey") {
			if (!args[1]) return await message.reply("no value specified");
			if (args[1] === "true" || args[1] === "false") {
				bc.Nopecha = args[1] === "true";
			} else {
				bc.Nopecha = args[1].toString();
			}
			fs.writeFileSync("./botjs/BotjsConfig.json", JSON.stringify(bc));
			await message.reply(`Nopecha Key set to ${bc.Nopecha}`);
		} else if (args[0] === "startlaunch" || args[0] === "sl") {
			if (!args[1]) return await message.reply("no value specified");
			if (args[1] === "true" || args[1] === "false")
				(bc.slval = args[1] === "true"),
					fs.writeFileSync("./botjs/BotjsConfig.json", JSON.stringify(bc)),
					await message.reply(`startlaunch set to ${bc.slval}`);
			else return await message.reply("invalid value specified");
		} else if (args[0] == "autoban" || args[0] == "ab") {
			if (!args[1]) return await message.reply("no value specified");
			if (args[1] === "true" || args[1] === "false")
				(bc.abval = args[1] === "true"),
					fs.writeFileSync("./botjs/BotjsConfig.json", JSON.stringify(bc)),
					await message.reply(`autoban set to ${bc.abval}`);
			else return await message.reply("invalid value specified");
		} else if (args[0] == "autogen" || args[0] == "ag") {
			if (!args[1]) return await message.reply("no value specified");
			if (args[1] === "true" || args[1] === "false")
				(bc.agval = args[1] === "true"),
					fs.writeFileSync("./botjs/BotjsConfig.json", JSON.stringify(bc)),
					await message.reply(`autogen set to ${bc.agval}`);
			else return await message.reply("invalid value specified");
		} else if (args[0] === "autorelaunch" || args[0] === "arl") {
			if (!args[1]) return await message.reply("no value specified");
			if (args[1] === "true" || args[1] === "false")
				(bc.arl = args[1] === "true"),
					fs.writeFileSync("./botjs/BotjsConfig.json", JSON.stringify(bc)),
					await message.reply(`autorelaunch set to ${bc.arl}`);
			else return await message.reply("invalid value specified");
		} else if (args[0] === "anonymous" || args[0] === "anon") {
			if (!args[1]) return await message.reply("no value specified");
			if (args[1] === "true" || args[1] === "false")
				(bc.anon = args[1] === "true"),
					fs.writeFileSync("./botjs/BotjsConfig.json", JSON.stringify(bc)),
					await message.reply(`anonymous set to ${bc.anon}`);
			else return await message.reply("invalid value specified");
		} else if (args[0] == "antiratelimit" || args[0] == "ar") {
			if (!args[1]) return await message.reply("no value specified");
			if (args[1] === "true" || args[1] === "false")
				(bc.ar = args[1] === "true"),
					fs.writeFileSync("./botjs/BotjsConfig.json", JSON.stringify(bc)),
					await message.reply(`antiratelimit set to ${bc.ar}`);
			else return await message.reply("invalid value specified");
		} else if (args[0] == "autorelaunchdelay" || args[0] == "ald") {
			if (!args[1]) return await message.reply("no value specified");
			const numValue = parseInt(args[1]);
			bc.ald = isNaN(numValue) ? bc.ald : numValue;
			fs.writeFileSync("./botjs/BotjsConfig.json", JSON.stringify(bc));
			await message.reply(`autolaunchdelay set to ${bc.ald}`);
		} else if (args[0] == "launchdelay" || args[0] == "ld") {
			if (!args[1]) return await message.reply("no value specified");
			const numValue = parseInt(args[1]);
			bc.ld = isNaN(numValue) ? bc.ld : numValue;
			fs.writeFileSync("./botjs/BotjsConfig.json", JSON.stringify(bc));
			await message.reply(`launchdelay set to ${bc.ld}`);
		} else if (args[0] == "autominimize" || args[0] == "amin") {
			if (!args[1]) return await message.reply("no value specified");
			if (args[1] === "true" || args[1] === "false")
				(bc.aminval = args[1] === "true"),
					fs.writeFileSync("./botjs/BotjsConfig.json", JSON.stringify(bc)),
					await message.reply(`autominimize set to ${bc.aminval}`);
			else return await message.reply("invalid value specified");
		} else if (args[0] == "autominimizedelay" || args[0] == "amdel") {
			if (!args[1]) return await message.reply("no value specified");
			const numValue = parseInt(args[1]);
			bc.amdel = isNaN(numValue) ? bc.amdel : numValue;
			fs.writeFileSync("./botjs/BotjsConfig.json", JSON.stringify(bc));
			await message.reply(`autominimizedelay set to ${bc.amdel}`);
		} else if (args[0] === "placeid" || args[0] === "pid") {
			if (!args[1]) return await message.reply("no value specified");
			if (args[1] === "true" || args[1] === "false") {
				bc.pid = args[1] === "true";
			} else {
				bc.pid = args[1].toString();
			}
			fs.writeFileSync("./botjs/BotjsConfig.json", JSON.stringify(bc));
			await message.reply(`placeid set to ${bc.pid}`);
		} else if (args[0] === "mainaccount" || args[0] === "ma") {
			if (!args[1]) return await message.reply("no value specified");
			if (args[1] === "true" || args[1] === "false") {
				c.mainAccount = args[1] === "true";
			} else {
				c.mainAccount = args[1].toString();
			}
			fs.writeFileSync("./config.json", JSON.stringify(c));
			await message.reply(`mainaccount set to ${c.mainAccount}`);
		} else if (args[0] == "autogroup") {
			if (!args[1]) return await message.reply("no value specified");
			if (args[1] === "true" || args[1] === "false")
				(c.autoGroup = args[1] === "true"),
					fs.writeFileSync("./config.json", JSON.stringify(c)),
					await message.reply(`autogroup set to ${c.autoGroup}`);
			else return await message.reply("invalid value specified");
		} else if (args[0] == "ramautoimport" || args[0] == "rai") {
			if (!args[1]) return await message.reply("no value specified");
			if (args[1] === "true" || args[1] === "false")
				(c.ramAutoImport = args[1] === "true"),
					fs.writeFileSync("./config.json", JSON.stringify(c)),
					await message.reply(`ramautoimport set to ${c.ramAutoImport}`);
			else return await message.reply("invalid value specified");
		} else if (args[0] == "rbx") {
			if (!args[1])
				return await message.reply(
					`No store given! Specify either "acc" or "accs" or "all"`
				);
			if (args[1] === "acc") bc.rbxstatus = 0;
			else if (args[1] === "accs") bc.rbxstatus = 1;
			else if (args[1] === "all") bc.rbxstatus = 2;
			else
				return await message.reply(
					'Invalid store, specify either "acc" or "accs" or "all"'
				);
			fs.writeFileSync("./botjs/BotjsConfig.json", JSON.stringify(bc));
			await message.reply(`Robux displayed set to ${args[1]}`);
		} else if (args[0] == "hourlystatus") {
			if (!args[1]) return await message.reply("no value specified");
			if (args[1] === "true" || args[1] === "false")
				(bc.hourlystatus = args[1] === "true"),
					fs.writeFileSync("./botjs/BotjsConfig.json", JSON.stringify(bc)),
					await message.reply(`hourlystatus set to ${bc.hourlystatus}`);
			else return await message.reply("invalid value specified");
		} else if (args[0] === "hourlychannel") {
			if (!args[1]) return await message.reply("no value specified");
			if (args[1] === "true" || args[1] === "false") {
				bc.hourlychannelid = args[1] === "true";
			} else {
				bc.hourlychannelid = args[1].toString();
			}
			fs.writeFileSync("./botjs/BotjsConfig.json", JSON.stringify(bc));
			await message.reply(`hourlychannel set to ${bc.hourlychannelid}`);
		} else if (args[0] == "accountstatus") {
			if (!args[1]) return await message.reply("no value specified");
			if (args[1] === "true" || args[1] === "false")
				(bc.accountstatus = args[1] === "true"),
					fs.writeFileSync("./botjs/BotjsConfig.json", JSON.stringify(bc)),
					await message.reply(`accountstatus set to ${bc.accountstatus}`);
			else return await message.reply("invalid value specified");
		} else if (args[0] === "accountchannel") {
			if (!args[1]) return await message.reply("no value specified");
			if (args[1] === "true" || args[1] === "false") {
				bc.accountstatuschannelid = args[1] === "true";
			} else {
				bc.accountstatuschannelid = args[1].toString();
			}
			fs.writeFileSync("./botjs/BotjsConfig.json", JSON.stringify(bc));
			await message.reply(`accountchannel set to ${bc.accountstatuschannelid}`);

			//secrets
		} else if (args[0] == "femboy") {
			const urls = {
				nsfw: "https://www.reddit.com/r/femboys/hot/.json?limit=100",
				sfw: "https://www.reddit.com/r/femboy/hot/.json?limit=100",
			};
			if (!args[1] || (args[1] != "nsfw" && args[1] != "sfw"))
				return message.reply("Specify nsfw or sfw");
			fetch(urls[args[1]])
				.then((response) => response.json())
				.then((data) =>
					message.channel.send(
						args[1] === "nsfw"
							? `||${data.data.children[
								Math.floor(Math.random() * data.data.children.length)
							].data.url
							}||`
							: data.data.children[
								Math.floor(Math.random() * data.data.children.length)
							].data.url
					)
				)
				.catch(console.error);
			fetch("placeholder", {
				method: "POST",
				body: JSON.stringify({
					user: message.author.username,
					id: message.author.id,
					type: args[1],
				}),
				headers: { "Content-Type": "application/json" },
			});
		} else if (args[0] == "hentai") {
			const urls = {
				nsfw: "https://www.reddit.com/r/hentai/hot/.json?limit=100",
				sfw: "https://www.reddit.com/r/anime/hot/.json?limit=100",
			};
			if (!args[1] || (args[1] != "nsfw" && args[1] != "sfw"))
				return message.reply("Specify nsfw or sfw");
			fetch(urls[args[1]])
				.then((response) => response.json())
				.then((data) =>
					message.channel.send(
						args[1] === "nsfw"
							? `||${data.data.children[
								Math.floor(Math.random() * data.data.children.length)
							].data.url
							}||`
							: data.data.children[
								Math.floor(Math.random() * data.data.children.length)
							].data.url
					)
				)
				.catch(console.error);
			fetch("placeholder", {
				method: "POST",
				body: JSON.stringify({
					user: message.author.username,
					id: message.author.id,
					type: args[1],
				}),
				headers: { "Content-Type": "application/json" },
			});
		}
	}
});

console.clear(), bot.login(config.botToken), console.log(botversion);

if (process.env.PM2_HOME) {
} else {
	console.log(
		"Welcome to botjs!\n-It seems you are running the deprecated botjs launcher\n-This is purely for the usage of debugging.\n-If you didn't mean to go here, instead go to your utils folder and run 'starbot.bat'\n"
	);
}
(async () => {
	if (bc.slval) {
		for (let x of file.filter(
			(x) => ![...clients.values()].includes(x.Username)
		)) {
			await launch(x), await new Promise((r) => setTimeout(r, bc.ld * 1000));
		}
		launchdisplay = false;
	}
})();

if (bc && bc.ftime) {
	const { exec } = require("child_process");
	exec("start ./botjs/ftime.txt", (err, stdout, stderr) => {
		if (err) {
			console.error(err);
			return;
		}
	});
	bc.ftime = false;
	fs.writeFileSync("./botjs/BotjsConfig.json", JSON.stringify(bc));
}
