const db = require('./db');
const ConteudoArquivoSchema = db.Mongoose.model('conteudo_arquivos', db.ConteudoArquivoSchema);
module.exports.tratarOutrosArquivos = function(conteudo, callback) {
    const dataCorrente = new Date();
    const entity = new ConteudoArquivoSchema(
        {
            nome: conteudo.nome,
            tamanho: parseInt(conteudo.tamanho || 0),
            conteudo: conteudo.conteudo,
            dataRegistro: dataCorrente
        });
    entity.save(callback);
}