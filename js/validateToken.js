const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/local')
    .then(() => console.log('connecting to MongoDB...'))
    .catch(err => console.error('could not connect to MongoDB...', err))

const tokenSchema = new mongoose.Schema({
    token: String
});

const Token = mongoose.model('Token', tokenSchema)
async function getTokens() {
    const tokens = await Token.find();
    returnlist = []
    tokens.forEach(token => {
        returnlist.push(token.token)
    })
    return returnlist
}
async function main() {
    const validTokens = await getTokens();

    try {
        const tokenData = fs.readFileSync('token.json');
        const { token } = JSON.parse(tokenData);

        if (validTokens.includes(token)) {
            process.exit(0);
        } else {
            process.exit(1);
        }
    } catch (_) {
        process.exit(1);
    }
}

main();
const fs = require('fs');

