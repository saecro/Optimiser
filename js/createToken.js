const crypto = require('./customCrypto');
let a = 0
while (a < 20) {
    const randomString = crypto.customUUID(128);
    console.log(randomString)
    a++
}