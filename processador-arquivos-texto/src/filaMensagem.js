const amqp = require('amqplib/callback_api');
const config = require('./config');

let amqpConn = null;
let qtdTentativas = 0;
function startFilaMensagem() {
    amqp.connect(config.RABBITMQ_URL + "?heartbeat=60", function(err, conn) {
        if (err) {
            console.error("[Fila] Erro: ", err.message);
            if (qtdTentativas === 3)
                return;
            qtdTentativas++;
            return setTimeout(startFilaMensagem, 1000);
        }
        conn.on("error", function(err) {
            if (err.message !== "Connection closing") {
                console.error("[Fila] Conexão erro: ", err.message);
            }
        });
        conn.on("close", function() {
            console.error("[Fila] Reconectando");
            if (qtdTentativas === 3)
                return;
            qtdTentativas++;
            return setTimeout(startFilaMensagem, 1000);
        });
        console.log("[Fila] Conectada");
        amqpConn = conn;
        startPublisher();
    });
}

let pubChannel = null;
function startPublisher() {
    amqpConn.createChannel(function(err, ch) {
        if (closeOnErr(err))
            return;
        ch.on("error", function(err) {
            console.error("[Fila] Channel erro: ", err.message);
        });
        ch.on("close", function() {
            console.log("[Fila] Channel fechado");
        });
        pubChannel = ch;
    });
}

function closeOnErr(err) {
    if (!err) return false;
    console.error("[Fila] Erro: ", err);
    amqpConn.close();
    return true;
}

let topicoFila = null;
module.exports.startFila = function (topico) {
    topicoFila = topico;
    startFilaMensagem();
}

module.exports.enviarMensagem = function (mensagem, callback) {
    try {
        const content = new Buffer.from(mensagem);
        pubChannel.assertQueue(topicoFila, { durable: false });
        pubChannel.sendToQueue(topicoFila, content);
        callback(true);
    } catch (e) {
        console.error("[Fila] enviarMensagem: ", e.message);
        callback(false);
    }
}