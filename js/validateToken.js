const { MongoClient } = require('mongodb');
const fs = require('fs');
const getHWID = require('./getHWID.js');
const { token } = require('../config.json');

const uri = 'mongodb+srv://indritsylemani:Indrit21.02@cluster.oaejsyu.mongodb.net';

async function getTokens() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('optimisedData');
    const collection = db.collection('SystemDetails');
    const tokens = await collection.find({}, { projection: { token: 1, _id: 0 } }).toArray();
    return tokens.map(t => t.token);
  } catch (err) {
    console.error('Could not connect to MongoDB...', err);
    return [];
  } finally {
    await client.close();
  }
}

function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

async function checkToken(token) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('optimisedData');
    const collection = db.collection('SystemDetails');
    const tokenDoc = await collection.findOne({ token });
    const currentTimezone = getTimezone();
    if (tokenDoc) {
      if (!tokenDoc.hwid) {
        const hwid = await getHWID();
        await collection.updateOne({ token }, { $set: { hwid, timezone: currentTimezone } });
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
  } finally {
    await client.close();
  }
}

async function main() {
  const validTokens = await getTokens();
  try {
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