const axios = require('axios');
const getHWID = require('./getHWID')
const { token } = require('../config.json');

async function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

async function validateTokenAPI() {
  try {
    const hwid = await getHWID();
    const timezone = await getTimezone();

    const response = await axios.get('http://localhost:3001/api/validate-token', {
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
  } catch (_) {
    return false;
  }
}

module.exports = validateToken;