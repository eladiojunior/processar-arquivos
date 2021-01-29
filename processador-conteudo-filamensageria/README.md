# Projeto em Nodejs para processamento de arquivos

Projeto (processador-conteudo-filamensageria) em NodeJs que realiza a leitura de uma fila de mensageria e processa os itens da fila (conteúdo de arquivo).
Como exemplo utilizei o RabbitMQ com fila de mensageria, MongoDB para repositório e arquivos dos Correios (TXT) para processar e carregar na base.

Regras:
1. Escuta a fila de mensageria e ao identificar um item na fila (linha de um arquivo texto) inicia o processamento (individual da linha).
2. Verifica o formato do item da fila (<code>{ nome: string, tamanho: int, conteudo: string }</code>), caso não esteja no padrão rejeita o conteúdo, mas não tira o item da fila.
3. Verifica se o conteúdo é de um arquivo dos correios (LOG_LOGRADOURO_*), com a informações de logradouros:
    1. não sendo, processa como um arquivo comum, registra na base collection <code>[conteudo_arquivos]</code>, as informações do item da fila;
    2. caso sendo um arquivo dos Correios [LOG_LOGRADOURO_*] verifica as regras conforme abaixo:
4. Separa o conteúdo arquivo (linha) pelo separador padrão "@" em colunas;
5. Verifica se possui a quantidade de colunas necessária para processamento;
6. Cria uma chave única do logradouro (Sigla Estado + CEP) para verificar a existência no banco;
7. Gera um HASH[sha256] do conteúdo da linha para comparação de alteração futura.
8. Verifica pela chave se o logradouro existe na base, 
    1. existindo, verifica comparando os hash's se houve alteração no conteúdo:
        1. caso exista diferença, registra no histórico de alteração na collection <code>[logradouros_historico]</code> e altera o conteúdo para o novo;
        2. caso NÃO exista diferença nos HASHs, apenas retira o item da fila    
    4. NÃO existindo, registra um novo logradouro na collection <code>[logradouros]</code>;

**Dependência:**

Dentro deste repositório tem outro projeto (processador-arquivo-texto) responsável pela processamento dos arquivos de uma determinada pasta de carga na fila de mensageria.

**Dica boa do Eladio...**
Para testar a escalabilidade do programa, instalei neste projeto o [PM2](https://pm2.keymetrics.io/docs/usage/quick-start/) para simular e monitorar. 

Para rodar em DESENVOLVIMENTO:
### `npm run dev`
###

Para rodar com PM2 em 'Produção':
### `npm run production`
### `pm2.cmd scale processar-conteudo-filamensageria +3`
### `pm2.cmd monit`
