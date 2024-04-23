const fs = require('fs');

try {
  const tokenData = fs.readFileSync('token.json');
  const { token } = JSON.parse(tokenData);


  const validToken = ['','','',''];

  if (validTokens.includes(token)) {
    console.log('Token validation successful.');
    process.exit(0);
  } else {
    console.log('Invalid token.');
    process.exit(1);
  }
} catch (error) {
  console.log('Error reading token.json:', error);
  process.exit(1);
}