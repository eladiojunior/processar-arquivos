const config = require('./config');
const amqp = require('amqplib/callback_api');

let amqpConn = null;
let qtdTentativas = 0;
let topicoFila = null;

function startFilaMensagem(callback) {
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
            console.error("[Fila] Reconectada");
            if (qtdTentativas === 3)
                return;
            qtdTentativas++;
            return setTimeout(startFilaMensagem, 1000);
        });
        console.log("[Fila] Conectada");
        amqpConn = conn;
        startWorker(callback);
    });
}
function startWorker(callback) {
    amqpConn.createChannel(function(err, ch) {
        if (closeOnErr(err)) return;
        ch.on("error", function(err) {
            console.error("[Fila] Channel erro: ", err.message);
        });
        ch.on("close", function() {
            console.log("[Fila] Channel fechado");
        });
        ch.prefetch(1);
        ch.assertQueue(topicoFila, { durable: false }, function(err) {
            if (closeOnErr(err))
                return;
            ch.consume(topicoFila, function (msg) {
                callback(msg, function (ok) {
                    try {
                        if (ok)
                            ch.ack(msg);
                        else
                            ch.reject(msg, true);
                    } catch (e) {
                        closeOnErr(e);
                    }
                })
            }, { noAck: false });
        });
    });
}
function closeOnErr(err) {
    if (!err) return false;
    console.error("[Fila] Erro: ", err);
    amqpConn.close();
    return true;
}

module.exports.startWorker = function (topico, callback) {
    topicoFila = topico;
    startFilaMensagem(callback);
}
