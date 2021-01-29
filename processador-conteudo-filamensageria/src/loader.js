const config = require('./config');
const filaMensagem = require('./filaMensagem');
const logradouro = require('./logradouro');
const outros = require('./outrosArquivos');

console.log("+==================================================+");
console.log("| BUSCAR NA FILA DE MENSAGENS E PROCESSA      v1.0 |");
console.log("+--------------------------------------------------+");
console.log("|      Programa responsável em retirar da fila de  |");
console.log("| mensageria o conteúdo do arquivo e processa o    |");
console.log("| conteúdo e armazena em banco de dados (NoSQL).   |");
console.log("+==================================================+");
console.log(` Ler a fila de mensageria: ${config.NOME_FILA_MENSAGERIA}`);
console.log("+--------------------------------------------------+");

filaMensagem.startWorker(config.NOME_FILA_MENSAGERIA, function (mensagem, callback) {

    //Verificar o conteúdo da mensagem... estou esperando um objeto:
    // { nome: string, tamanho: int, conteudo: string }
    const conteudo = JSON.parse(mensagem.content.toString());
    if (!conteudo.nome)
    {//Conteúdo não possue atributo nome...
        conteudo.log("Conteúdo fora do padrão: { nome: string, tamanho: int, conteudo: string }");
        callback(false); //Não retirar da fila...
        return;
    }

    if (conteudo.nome.toUpperCase().includes("LOG_LOGRADOURO"))
    //Tratar os arquivos de logradouro dos Correios, layout bem específico.
        logradouro.tratarLogradouro(conteudo, function (erro) {
            if (erro) {
                console.error("Erro no tratarLogradouro: ", erro);
                callback(false);
                return;
            }
            callback(true);
        });
    else
        outros.tratarOutrosArquivos(conteudo, function (erro) {
            if (erro) {
                console.error("Erro no tratarOutrosArquivos: ", erro);
                callback(false);
                return;
            }
            callback(true);
        });

});