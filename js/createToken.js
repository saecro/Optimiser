const crypto = require('./customCrypto');
const { MongoClient } = require('mongodb');
const axios = require('axios')

async function storeUUID() {
    newToken = await axios.get('http://localhost:3001/api/createtoken')
    console.log('new token is ' + { newToken } )
}

storeUUID();