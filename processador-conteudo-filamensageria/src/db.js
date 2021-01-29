/* Importar o modulo do MongoDB com Mongose (OER) */
const mongoose = require('mongoose');
const config = require('./config');

var options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    connectTimeoutMS: 10000,
    user: config.MONGO_ROOT_USERNAME,
    pass: config.MONGO_ROOT_PASSWORD
};
const url_conn = 'mongodb://'+config.MONGO_HOSTNAME+':'+config.MONGO_PORT+'/'+config.MONGO_DATABASE+'?authSource=admin';
mongoose.connect(url_conn, options).then(function() {
    console.log('MongoDB ['+config.MONGO_DATABASE+'] conectado.');
});
//Definir os schemas do banco.
const arquivoSchema = new mongoose.Schema({
    nome: String,
    tamanho: Number,
    conteudo: String,
    dataRegistro: Date
    }, { collection: 'conteudo_arquivos' }
);
const logradouroSchema = new mongoose.Schema(
    {
        chaveLogradouro: String,
        numero: Number,
        siglaUf: String,
        chaveLocalidade: String,
        chaveBairroInicio: Number,
        chaveBairroFim: Number,
        nomeLogradouro: String,
        complementoLogradouro: String,
        cepLogradouro: String,
        tipoLogradouro: String,
        tipoLogradouroUtilizado: String,
        abreviacaoNomeLogradouro: String,
        dataRegistro: Date,
        dataAtualizacao: Date,
        hashLogradouro: String
    }, { collection: 'logradouros' }
);
const logradouroHistoricoSchema = new mongoose.Schema(
    {
        chaveLogradouro: String,
        numero: Number,
        siglaUf: String,
        chaveLocalidade: String,
        chaveBairroInicio: Number,
        chaveBairroFim: Number,
        nomeLogradouro: String,
        complementoLogradouro: String,
        cepLogradouro: String,
        tipoLogradouro: String,
        tipoLogradouroUtilizado: String,
        abreviacaoNomeLogradouro: String,
        dataRegistro: Date,
        hashLogradouro: String
    }, { collection: 'logradouros_historico' }
);

module.exports = { Mongoose: mongoose,
    ConteudoArquivoSchema: arquivoSchema,
    LogradouroSchema: logradouroSchema,
    LogradouroHistoricoSchema: logradouroHistoricoSchema }