const { MongoClient } = require('mongodb');
const { token } = require('../config.json')
// MongoDB connection details
const uri = 'mongodb+srv://indritsylemani:Indrit21.02@cluster.oaejsyu.mongodb.net/optimisedData';

async function checkAndUpdateDetails() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('optimisedData');
        const collection = db.collection('SystemDetails');

        // Read the token from the config.json file
        console.log(token)
        // Check if the document with the same token exists
        const existingDocument = await collection.findOne({ token });

        if (existingDocument) {
            const updatedFields = {};

            if (!existingDocument.botToken) {
                const botToken = await promptUser('Enter the bot Token (for your discord bot): ');
                updatedFields.botToken = botToken;
                console.log('Bot Token updated successfully!');
            }
            if (!existingDocument.discordUserId) {
                const discordUserId = await promptUser('Enter your discord user ID (this is so you can ask admin level commands): ');
                updatedFields.discordUserId = discordUserId;
                console.log('Discord ID updated successfully!');
            }

            if (Object.keys(updatedFields).length > 0) {
                await collection.updateOne({ token }, { $set: updatedFields });
            } else {
                console.log('No fields need to be updated.');
            }
        } else {
            console.log('Document not found. No updates made.');
        }
    } catch (err) {
        console.error('Error checking or updating details:', err);
    } finally {
        await client.close();
    }
}

async function promptUser(message) {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        readline.question(message, (answer) => {
            readline.close();
            resolve(answer);
        });
    });
}

checkAndUpdateDetails();