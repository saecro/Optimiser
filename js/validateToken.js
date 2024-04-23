const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/local')
    .then(() => console.log('connecting to MongoDB...'))
    .catch(err => console.error('could not connect to MongoDB...', err))

const tokenSchema = new mongoose.Schema({
    token: String
});

const Token = mongoose.model('Token', tokenSchema)
async function getTokens() {
    console.log('getting tokens')
    const tokens = await Token.find();
    returnlist = []
    tokens.forEach(token => {
        returnlist.push(token.token)
    })
    return returnlist
}
async function main() {
    const validTokens = await getTokens();
    console.log(validTokens);

    try {
        const tokenData = fs.readFileSync('token.json');
        const { token } = JSON.parse(tokenData);

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
}

main();
const fs = require('fs');

