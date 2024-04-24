const mongoose = require('mongoose');
const fs = require('fs');
const getHWID = require('./getHWID');

mongoose.connect('mongodb://localhost/local')
  .then(() => console.log('Connecting to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const tokenSchema = new mongoose.Schema({
  token: String,
  hwid: String,
  isFirstTime: Boolean,
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

async function checkToken(token) {
  try {
    const tokenDoc = await Token.findOne({ token });

    if (tokenDoc) {
      if (tokenDoc.isFirstTime) {
        const hwid = await getHWID();
        tokenDoc.hwid = hwid;
        tokenDoc.isFirstTime = false;
        await tokenDoc.save();
        console.log('HWID added to the token:', hwid);
      } else {
        console.log('Token has been used before. HWID not added.');
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