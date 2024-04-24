const mongoose = require('mongoose');
const fs = require('fs');
const getHWID = require('./getHWID');

mongoose.connect('mongodb://localhost/local')
  .then(() => console.log('Connecting to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const tokenSchema = new mongoose.Schema({
  token: String,
  hwid: String,
  timezone: String,
});

const Token = mongoose.model('Token', tokenSchema);

async function getTokens() {
  const tokens = await Token.find();
  const returnlist = [];
  tokens.forEach(token => {
    returnlist.push(token.token);
  });
  return returnlist;
}

function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

async function checkToken(token) {
  try {
    const tokenDoc = await Token.findOne({ token });
    const currentTimezone = getTimezone();

    if (tokenDoc) {
      if (!tokenDoc.hwid) {
        const hwid = await getHWID();
        tokenDoc.hwid = hwid;
        tokenDoc.timezone = currentTimezone;
        await tokenDoc.save();
      } else {
        const hwid = await getHWID();
        if (tokenDoc.timezone !== currentTimezone || tokenDoc.hwid !== hwid) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error checking token:', error);
    return false;
  }
}

async function main() {
  const validTokens = await getTokens();

  try {
    const tokenData = fs.readFileSync('config.json');
    const { token } = JSON.parse(tokenData);

    if (validTokens.includes(token)) {
      const isValid = await checkToken(token);
      if (isValid) {
        process.exit(0);
      } else {
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  } catch (_) {
    process.exit(1);
  }
}

main();