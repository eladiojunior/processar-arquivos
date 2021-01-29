const crypto = require('crypto');
const gerarHash = function hash(conteudo) {
    const hmac = crypto.createHmac('sha256', "CASSI");
    return hmac.update(conteudo).digest('hex');
};

console.log("HASH1: " + gerarHash("Testando o conteúdo da variável"));
console.log("HASH2: " + gerarHash("Testando o conteúdo da variável"));
