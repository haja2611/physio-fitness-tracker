// generateSecret.js
const crypto = require("crypto");

const generateSecret = crypto.randomBytes(32).toString("hex");
return generateSecret;
console.log(generateSecret);

module.exports = generateSecret;
