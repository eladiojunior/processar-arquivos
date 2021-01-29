
const crypto = require('crypto');
const gerarHash = function hash(conteudo) {
    const hmac = crypto.createHmac('sha256', "CASSI");
    return hmac.update(conteudo).digest('hex');
};

const db = require('./db');
const LogradouroSchema = db.Mongoose.model('logradouros', db.LogradouroSchema);
const LogradouroHistoricoSchema = db.Mongoose.model('logradouros_historico', db.LogradouroHistoricoSchema);

module.exports.tratarLogradouro = function(registro, callback) {

    try {

        const atributos = registro.conteudo.split("@");
        if (!atributos || atributos.length < 11) {
            return callback(null);
        }

        const chaveLogradouro = (atributos[1].trim() + atributos[7].trim());
        const conteudoLogradouro = atributos.join("");
        const hashLogradouro = gerarHash(conteudoLogradouro);

        LogradouroSchema.find({chaveLogradouro: chaveLogradouro},
            function (erro, itens) {
                if (erro)
                    return callback(erro);
                if (itens.length !== 0)
                {//Existe...

                    //Verificar se ele foi alterado, comparando os Hash's (Strings);
                    if (itens[0].hashLogradouro !== hashLogradouro)
                    {//Diferentes, gerar histórico e atualizar o banco...
                        gravarHistorico(itens[0], function (erro, item) {
                            if (erro)
                                return callback(erro);
                            atualizarLogradouro(chaveLogradouro, atributos, function (erro, res) {
                                return callback(erro);
                            });
                        });
                    }
                    else
                    {//Hash são iguais... não faz nada ainda!
                        return callback(null); //Não faz
                    }
                }
                else
                {//Não existe registrar novo
                    registrarLogradouro(chaveLogradouro, atributos, hashLogradouro, function (erro, item) {
                        return callback(erro);
                    });
                }
            });

    } catch (erro) {
        console.error("Tratar informações de logradouro, erro: " + erro);
        return callback(erro);
    }
}

function gravarHistorico(item, callback) {
    try {
        const dataCorrente = new Date();
        const registro = {
            chaveLogradouro: item.chaveLogradouro,
            numero: item.numero,
            siglaUf: item.siglaUf,
            chaveLocalidade: item.chaveLocalidade,
            chaveBairroInicio: item.chaveBairroInicio,
            chaveBairroFim: item.chaveBairroFim,
            nomeLogradouro: item.nomeLogradouro,
            complementoLogradouro: item.complementoLogradouro,
            cepLogradouro: item.cepLogradouro,
            tipoLogradouro: item.tipoLogradouro,
            tipoLogradouroUtilizado: item.tipoLogradouroUtilizado,
            abreviacaoNomeLogradouro: item.abreviacaoNomeLogradouro,
            dataRegistro: dataCorrente,
            hashLogradouro: item.hashLogradouro
        };
        LogradouroHistoricoSchema.create(registro, function (erro, item){
            callback(erro, item);
        });
    } catch (erro) {
        console.error("Registrar Histórico Logradouro, erro: " + erro);
        callback(erro, null);
    }
}
function atualizarLogradouro(chaveLogradouro, atributos, callback) {
    try {
        const dataCorrente = new Date();
        const registro = {
            numero: parseInt(atributos[0].trim() === "" ? 0 : atributos[0].trim()),
            chaveLocalidade: atributos[2].trim(),
            chaveBairroInicio: parseInt(atributos[3].trim() === "" ? 0 : atributos[3].trim()),
            chaveBairroFim: parseInt(atributos[4].trim() === "" ? 0 : atributos[4].trim()),
            nomeLogradouro: atributos[5].trim(),
            complementoLogradouro: atributos[6].trim(),
            tipoLogradouro: atributos[8].trim(),
            tipoLogradouroUtilizado: atributos[9].trim(),
            abreviacaoNomeLogradouro: atributos[10].trim(),
            dataAtualizacao: dataCorrente,
        };
        LogradouroSchema.updateOne({chaveLogradouro: chaveLogradouro}, registro, null, function (erro, res) {
            callback(erro, res);
        });
    } catch (erro) {
        console.error("Atualizar Logradouro, erro: " + erro);
        callback(erro, null);
    }
}
function registrarLogradouro(chaveLogradouro, atributos, hashLogradouro, callback) {
    try {
        const dataCorrente = new Date();
        const registro = {
            chaveLogradouro: chaveLogradouro,
            numero: parseInt(atributos[0].trim() === "" ? 0 : atributos[0].trim()),
            siglaUf: atributos[1].trim(),
            chaveLocalidade: atributos[2].trim(),
            chaveBairroInicio: parseInt(atributos[3].trim() === "" ? 0 : atributos[3].trim()),
            chaveBairroFim: parseInt(atributos[4].trim() === "" ? 0 : atributos[4].trim()),
            nomeLogradouro: atributos[5].trim(),
            complementoLogradouro: atributos[6].trim(),
            cepLogradouro: atributos[7].trim(),
            tipoLogradouro: atributos[8].trim(),
            tipoLogradouroUtilizado: atributos[9].trim(),
            abreviacaoNomeLogradouro: atributos[10].trim(),
            dataRegistro: dataCorrente,
            dataAtualizacao: null,
            hashLogradouro: hashLogradouro
        };
        LogradouroSchema.create(registro, function (erro, item){
            callback(erro, item);
        });
    } catch (erro) {
        console.error("Registrar Logradouro, erro: " + erro);
        callback(erro, null);
    }
}