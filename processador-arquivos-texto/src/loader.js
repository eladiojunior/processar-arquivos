const path = require('path');
const fs = require('fs');
const es = require('event-stream');
const config = require('./config');
const fila = require('./filaMensagem');

console.log("+==================================================+");
console.log("|        PROCESSAR ARQUIVOS DOS TEXTOS v1.0        |");
console.log("+--------------------------------------------------+");
console.log("|      Programa responsável pelo processamento dos |");
console.log("| arquivos de uma pasta definida onde ficará sendo |");
console.log("| escutada para qualquer arquivo texto, será lido  |");
console.log("| e suas linhas colocadas em uma fila de mensagem  |");
console.log("| para verificação (outro programa).               |");
console.log("+==================================================+");
console.log(` Escutando o caminho: ${config.PATH_ARQUIVOS_TEXTOS}`);
console.log("+--------------------------------------------------+");

fila.startFila(config.NOME_FILA_MENSAGERIA);

let arquivos = [];

//Verificação inicial.
setTimeout(verificarDiretorio, 1000, config.PATH_ARQUIVOS_TEXTOS);

//Ativar escuta do diretório.
const watcher = fs.watch(config.PATH_ARQUIVOS_TEXTOS, (eventType, filename) => {
    if (eventType === "change")
        verificarDiretorio(config.PATH_ARQUIVOS_TEXTOS);
});

/**
 * Verificar o diretorio para identificar arquivos para processamento.
 * @param dir - path do diretorio.
 */
function verificarDiretorio(dir) {
    if (!dir) return;

    verificarEstruturaDiretorios(dir);

    fs.readdirSync(dir).forEach(nomeArquivo => {
        const localArquivo = dir + "\\" + nomeArquivo;
        fs.lstat(localArquivo, function (err, stats) {
            if (err) {
                console.error("Erro: ", err);
                return;
            }
            if (stats.isFile() && stats.mode === 33206) {
                if (obterExtensaoArquivo(localArquivo) !== "TXT") {
                    console.log(`Arquivo [${nomeArquivo}] inválido.`);
                    return;
                }
                verificarArquivo(localArquivo, nomeArquivo, stats.size);
            }
        })
    });

}

/**
 * Obtem a extensão do arquivo pelo seu nome, retirando o ponto final.
 * @param arquivo - Nome do arquivo.
 * @returns {string} (ARQUIVO.txt) = TXT
 */
function obterExtensaoArquivo(arquivo) {
    let extensao = path.extname(arquivo||'').split('.');
    return (extensao[extensao.length-1]).toUpperCase(); //Retirar o ponto e colocar em maúsculo.
}

/**
 * Verifica se a estrutura de diretórios existe para processamento.
 * @param diretorio
 */
function verificarEstruturaDiretorios(diretorio) {

    //Verificar se existe o diretório que o programa está escutando;
    if (!fs.existsSync(diretorio)) {
        fs.mkdirSync(dir, {recursive: true});
    }

    //Verificar se existe os diretórios de "sucesso", "erro";
    const dirSucesso = diretorio + "\\sucesso";
    if (!fs.existsSync(dirSucesso)) {
        fs.mkdirSync(dirSucesso);
    }

    const dirErro = diretorio + "\\erro";
    if (!fs.existsSync(dirErro)) {
        fs.mkdirSync(dirErro);
    }

}

/**
 * Verifica o arquivo para processamento.
 * @param local - Path do arquivo.
 * @param nome - Nome do arquivo.
 * @param tamanho - Tamanho em bytes do arquivo.
 */
function verificarArquivo(local, nome, tamanho) {

    const item = arquivos.find(el => el.nome === nome);
    if (item) {
        if (item.tamanho === tamanho) {
            return;
        } else {
            arquivos = arquivos.filter(el => el.nome !== nome);
        }
    }

    if (!fs.existsSync(local))
        return;

    //Processamento do arquivo:
    let arquivo = {nome: nome, tamanho: tamanho, linha: 0, conteudo: ""};
    let nrLinha = 0;
    const stream = fs.createReadStream(local, {encoding: 'utf8'});
    stream.pipe(es.split('\r\n'))
        .pipe(es.mapSync(function (linha) {
            if (linha.trim() !== "") {
                nrLinha++;
                arquivo.linha = nrLinha;
                arquivo.conteudo = linha;
                const mensagem = JSON.stringify(arquivo);
                fila.enviarMensagem(mensagem, function (ok) {
                    if (!ok)
                        console.log("Conteúdo não enviado: " + mensagem);
                });
            }
        }))
        .on('error', function (erro) {
            console.log("Erro na leitura do arquivo.", erro);
            const destino = config.PATH_ARQUIVOS_TEXTOS + "\\erro\\" + nome;
            moverArquivoDoDiretorio(local, destino);
        }).on('end', function () {
            console.log(`Arquivo processado: ${local}`);
            const destino = config.PATH_ARQUIVOS_TEXTOS + "\\sucesso\\" + nome;
            moverArquivoDoDiretorio(local, destino);
        });

    //Registrar como processado.
    arquivos.push({"nome": nome, "tamanho": tamanho});

}

/**
 * Move o arquivo da pasta de origem e encaminha para pasta informada.
 * @param origem - local do arquivo de origem.
 * @param destino - local de destivo da arquivo.
 */
function moverArquivoDoDiretorio(origem, destino) {
    fs.copyFile(origem, destino, function (erro) {
        if (erro) {
            console.log("Erro, não foi possível copiar o arquivo.");
            return;
        }
        fs.unlink(origem, function (erro) {
            if (erro) {
                console.log("Erro, não foi possível remover o arquivo.");
                return;
            }
        });
    });
}