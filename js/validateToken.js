const os = require('os')
const axios = require('axios');
const getHWID = require('./getHWID')
const { token } = require('../config.json');
const getIP = require('./getIP')
async function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

async function validateTokenAPI() {
  try {
    const hwid = await getHWID();
    const timezone = await getTimezone();
    const ip = getIP()
    const response = await axios.get('http://localhost:3001/api/validate-token', {
      params: {
        token,
        hwid,
        timezone,
        ip,
      },
    });
    return response.data.valid;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
}

async function validateToken() {
  try {
    const isValid = await validateTokenAPI();
    if (isValid) {
      console.log('Token valid');
      return true;
    } else {
      console.log('Token invalid');
      return false;
    }
  } catch (e) {
    return false;
  }
}

module.exports = validateToken;