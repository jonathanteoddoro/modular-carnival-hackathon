const crypto = require("crypto");

const ENCRYPTION_KEY = crypto.randomBytes(32).toString("hex"); // Gera uma chave aleatória de 256 bits

console.log(ENCRYPTION_KEY);
