const crypto = require('crypto');

function generateRandomString(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[];~:,.<>?';
    let result = '';

    const randomBytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
        const randomIndex = randomBytes[i] % charset.length;
        result += charset.charAt(randomIndex);
    }

    return result;
}

crypto.customUUID = generateRandomString;

module.exports = crypto;