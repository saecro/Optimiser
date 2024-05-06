const axios = require('axios')
const fs = require('fs').promises;

async function storeUUID() {
  let tokens = '';
  let i = 0;
  while (i < 100) {
    const response = await axios.get('http://localhost:3001/api/createtoken');
    const token = response.data.token;
    tokens += token + '\n';
    i++;
  }

  try {
    await fs.writeFile('tokens.txt', tokens);
    console.log('Tokens saved to tokens.txt');
  } catch (err) {
    console.error('Error saving tokens to file:', err);
  }
}

storeUUID();