const axios = require('axios');
const { token } = require('../config.json');
const getHWID = require('./getHWID.js');
const readline = require('readline');
const getIP = require('./getIP.js')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function promptUser(message) {
  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      resolve(answer);
    });
  });
}

async function startup() {
  const hwid = await getHWID();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const ip = getIP()
  try {
    const response = await axios.get('http://localhost:3001/api/startup', {
      params: { token, hwid, timezone, ip },
    });

    if (response.data.prompts) {
      const updatedFields = {};

      for (const prompt of response.data.prompts) {
        const answer = await promptUser(`${prompt}: `);
        if (prompt.includes('bot Token')) {
          updatedFields.botToken = answer;
        } else if (prompt.includes('discord user ID')) {
          updatedFields.discordUserId = answer;
        }
      }

      if (Object.keys(updatedFields).length > 0) {
        await axios.get('http://localhost:3001/api/update', {
          params: { token, updatedFields },
        });
        console.log('Fields updated successfully!');
      }
    } else if (response.data.message) {
      console.log(response.data.message);
    }
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

module.exports = startup;