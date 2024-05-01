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
  
app.get('/', async (req, res) => {
    console.log('got default connection to api');
    res.send('Welcome to the API');
});

const port = 3001
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});