const path = require('path');
require('dotenv').config({path:path.resolve(__dirname, '../.env')});
const config = {
    RABBITMQ_URL: process.env.RABBITMQ_URL || "amqp://localhost:5672",
    RABBITMQ_USER: process.env.RABBITMQ_USER || "guest",
    RABBITMQ_PASS: process.env.RABBITMQ_PASS || "guest",
    NOME_FILA_MENSAGERIA: process.env.NOME_FILA_MENSAGERIA || "Teste",
    PATH_ARQUIVOS_TEXTOS: process.env.PATH_ARQUIVOS_TEXTOS || "D:\\Temp\\"
}
module.exports = config;