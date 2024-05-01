const path = require('path');
const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();
const uri = process.env.MONGODB_URI;

async function validateToken({ token, hwid, timezone }, client) {
    console.log('accessed validation api')
    await client.connect();

    const db = client.db('optimisedData');
    const collection = db.collection('SystemDetails');

    const tokenDoc = await collection.findOne({ token });

    if (tokenDoc) {
        if (!tokenDoc.hwid) {
            await collection.updateOne({ token }, { $set: { hwid, timezone } });
            return true
        } else {
            if (tokenDoc.timezone === timezone && tokenDoc.hwid === hwid) {
                console.log('successful validation')
                return true
            } else {
                console.log('unsuccessful validation')
                return false
            }
        }
    } else {
        return false;
    }

}
app.get('/api/validate-token', async (req, res) => {
    console.log('validatetoken api')

    const query = req.query;
    const client = new MongoClient(uri);

    try {
        res.json({ valid: await validateToken(query, client) });
    } catch (err) {

        console.error('Error validating token:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {

        await client.close();
    }

});

app.get('/api/getbot-token', async (req, res) => {
    console.log('getbottoken api')
    const query = req.query;
    const client = new MongoClient(uri);

    try {
        // Validate the token first
        const isValidToken = await validateToken(query, client);

        if (isValidToken) {
            await client.connect();
            const db = client.db('optimisedData');
            const collection = db.collection('SystemDetails');
            // Find the document based on the provided token
            const doc = await collection.findOne({ token: query.token });

            if (doc) {
                // Extract the required fields from the document
                const { botToken, discordUserId } = doc;
                res.json({ botToken, discordUserId });
            } else {
                res.status(404).json({ error: 'Document not found' });
            }
        } else {
            res.status(401).json({ error: 'Invalid token' });
        }
    } catch (err) {
        console.error('Error getting botToken:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
});

app.get('/api/startup', async (req, res) => {
    console.log('startup api');
    const query = req.query;
    const client = new MongoClient(uri);

    try {
        // Validate the token first
        const isValidToken = await validateToken(query, client);

        if (isValidToken) {
            try {
                await client.connect();
                const db = client.db('optimisedData');
                const collection = db.collection('SystemDetails');
                const { token } = query;
                // Check if the document with the same token exists
                const existingDocument = await collection.findOne({ token });

                if (existingDocument) {
                    const prompts = [];

                    if (!existingDocument.botToken) {
                        prompts.push('Enter the bot Token (for your discord bot)');
                    }
                    if (!existingDocument.discordUserId) {
                        prompts.push('Enter your discord user ID (this is so you can ask admin level commands)');
                    }

                    if (prompts.length > 0) {
                        res.json({ prompts });
                    } else {
                        console.log('No fields need to be updated.');
                        res.json({ message: 'No fields need to be updated.' });
                    }
                } else {
                    console.log('Document not found. No updates made.');
                    res.status(404).json({ error: 'Document not found' });
                }
            } catch (err) {
                console.error('Error checking or updating details:', err);
                res.status(500).json({ error: 'Internal server error' });
            } finally {
                await client.close();
            }
        } else {
            res.status(401).json({ error: 'Invalid token' });
        }
    } catch (err) {
        console.error('Error getting botToken:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
});

app.get('/api/update', async (req, res) => {
    const { token, updatedFields } = req.query;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('optimisedData');
        const collection = db.collection('SystemDetails');

        // Update the document with the provided fields
        await collection.updateOne({ token }, { $set: updatedFields });

        res.json({ message: 'Fields updated successfully' });
    } catch (err) {
        console.error('Error updating fields:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
});

app.get('/', async (req, res) => {
    console.log('got default connection to api');
    res.send('Welcome to the API');
});

const port = 3001
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

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