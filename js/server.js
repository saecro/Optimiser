const path = require('path');
const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();
const uri = process.env.MONGODB_URI;

app.get('/api/validate-token', async (req, res) => {
  const { token, hwid, timezone } = req.query;

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('optimisedData');
    const collection = db.collection('SystemDetails');

    const tokenDoc = await collection.findOne({ token });

    if (tokenDoc) {
      if (!tokenDoc.hwid) {
        await collection.updateOne({ token }, { $set: { hwid, timezone } });
        res.json({ valid: true });
      } else {
        if (tokenDoc.timezone === timezone && tokenDoc.hwid === hwid) {
          res.json({ valid: true });
        } else {
          res.json({ valid: false });
        }
      }
    } else {
      res.json({ valid: false });
    }
  } catch (err) {
    console.error('Error validating token:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on port 3000');
  });