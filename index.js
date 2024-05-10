const fs = require('fs');

const configFilePath = './config.json';
const configTemplate = {
    token: '',
};

function createConfigFile() {
    const configJson = JSON.stringify(configTemplate, null, 4);
    fs.writeFileSync(configFilePath, configJson);
    console.log('config.json created successfully!');
}

function validateConfigFile() {
    try {
        if (fs.existsSync(configFilePath)) {
            const configData = fs.readFileSync(configFilePath, 'utf8');

            try {
                const config = JSON.parse(configData);

                if (!config.hasOwnProperty('token') || typeof config.token !== 'string') {
                    console.log('config.json has an invalid structure. Recreating with the default template.');
                    createConfigFile();
                }
            } catch (parseError) {
                console.log('config.json has an invalid JSON structure. Recreating with the default template.');
                createConfigFile();
            }
        } else {
            console.log('config.json not found. Creating with the default template.');
            createConfigFile();
        }
    } catch (error) {
        console.error('Error reading or parsing config.json:', error);
        process.exit(1);
    }
}

validateConfigFile();

const startBot = require('./js/bot.js')
const fix = require('./js/fix.js')
const startup = require('./js/startup.js');
const validateToken = require('./js/validateToken.js')
const prompt = require("prompt-sync")({ sigint: true });
const getPerformanceStats = require('./js/getPerformanceStats.js')

async function getPCStats() {
    console.log('getting performance')
    console.log(await getPerformanceStats())

}
function printOptions() {
    console.log('[1] Get PC stats')
    console.log('[2] Clear Useless Files')
    console.log('[3] Disk cleanup')
    console.log('[4] Defragment disk')
    console.log('[5] Update drivers')
    console.log('[6] Disable startup programs')
    console.log('[7] Run a discord bot')
    console.log('[8] Optimize network settings')
    console.log('[9] Repair system files')
    console.log('[10] Manage power settings')
}
async function main() {
    try {
        const isTokenValid = await validateToken();

        if (!isTokenValid) {
            console.error('Token validation failed. Stopping the script.');
            process.exit(1)
        }

        await Promise.all([fix(), startup()]);
        console.log('All validations completed successfully.');
    } catch (error) {
        console.error('Validation failed:', error);
    }

    while (true) {
        console.clear()
        printOptions()
        const options = parseFloat(prompt(''));
        switch (options) {
            case 1:
                await getPCStats()
                console.log('Press any key to continue...');
                prompt();
                break;
            case 2:
                await clearFiles()
                console.log('Press any key to continue...');
                prompt();
                break;
            case 3:
                await cleanDisks()
                console.log('Press any key to continue...');
                prompt();
                break;
            case 4:
                await xxxxxxxxxx()
                console.log('Press any key to continue...');
                prompt();
                break;
            case 5:
                await updateDrivers()
                console.log('Press any key to continue...');
                prompt();
                break;
            case 6:
                await disablePrograms()
                console.log('Press any key to continue...');
                prompt();
                break;
            case 7:
                await startBot()
                console.log('Press any key to continue...');
                prompt();
                break;
            case 8:
                await optimiseNetworkSettings()
                console.log('Press any key to continue...');
                prompt();
                break;
            case 9:
                await repairFiles()
                console.log('Press any key to continue...');
                prompt();
                break;
            case 10:
                await managePowerSettings()
                console.log('Press any key to continue...');
                prompt();
                break;

        }

    }
}


main();