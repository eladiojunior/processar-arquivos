const path = require('path');
require('dotenv').config({path:path.resolve(__dirname, '../.env')});
const config = {
    RABBITMQ_URL: process.env.RABBITMQ_URL || "amqp://localhost:5672",
    RABBITMQ_USER: process.env.RABBITMQ_USER || "guest",
    RABBITMQ_PASS: process.env.RABBITMQ_PASS || "guest",

    NOME_FILA_MENSAGERIA: process.env.NOME_FILA_MENSAGERIA || "Teste",

    MONGO_ROOT_USERNAME: process.env.MONGO_ROOT_USERNAME || "root",
    MONGO_ROOT_PASSWORD: process.env.MONGO_ROOT_PASSWORD || "root",
    MONGO_DATABASE: process.env.MONGO_DATABASE || "db_conteudo_arquivos",
    MONGO_HOSTNAME: process.env.MONGO_HOSTNAME || "localhost",
    MONGO_PORT: process.env.MONGO_PORT || 27017

}
module.exports = config;