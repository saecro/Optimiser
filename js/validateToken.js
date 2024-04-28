const axios = require('axios');
const getHWID = require('./getHWID.js');
const { token } = require('../config.json');

async function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

async function validateToken() {
  try {
    const hwid = await getHWID();
    const timezone = await getTimezone();

    const response = await axios.get('http://192.168.50.182:3000/api/validate-token', {
      params: {
        token,
        hwid,
        timezone,
      },
    });

    return response.data.valid;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
}

async function main() {
  try {
    const isValid = await validateToken();
    if (isValid) {
        console.log('token valid')
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (_) {
    process.exit(1);
  }
}

main();