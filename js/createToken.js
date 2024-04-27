const crypto = require('./customCrypto');
const { MongoClient } = require('mongodb');

// MongoDB connection details
const uri = 'mongodb+srv://indritsylemani:Indrit21.02@cluster.oaejsyu.mongodb.net/optimisedData';

async function storeUUID() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('optimisedData');
        const collection = db.collection('SystemDetails');

        const randomString = crypto.customUUID(128);
        const currentTimezone = ""
        const hwid = ''; // Placeholder for hardware ID
        const botToken = '';
        const discordUserId = '';
        const result = await collection.insertOne({
            token: randomString,
            hwid: hwid,
            timezone: currentTimezone,
            botToken: botToken,
            discordUserId: discordUserId
        });

        console.log('config saved to MongoDB:', randomString);
    } catch (err) {
        console.error('Error saving UUID to MongoDB:', err);
    } finally {
        await client.close();
    }
}

storeUUID();