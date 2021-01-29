# Projeto em Nodejs para processamento de arquivos

Projeto (processador-arquivo-texto) em NodeJs que escuta uma determinada pasta (diretório) processa os arquivos e envia seu conteúdo (linha-a-linha) para fila de mensageria.
Como exemplo utilizei o RabbitMQ com fila de mensageria e arquivos dos Correios (TXT).

Regras:
1. Escuta uma pasta configurada no <code>.env</code> e ao identificar um arquivo TXT ele processa seu conteúdo;
2. Coloca no formato do item da fila (<code>{ nome: string, tamanho: int, conteudo: string }</code>);
3. Envia para fila de mensageria para aguardar o processamento;

**Exemplo:**

Na pasta "arquivos" temos alguns exemplos de arquivos de logradouro dos estados de DF, MG e MA dos Correios para teste;

**Dependência:**

Dentro deste repositório tem outro projeto (processador-conteudo-filamensageria) responsável por processa o conteúdo da fila de mensageria.

Para rodar em DESENVOLVIMENTO:
### `npm run dev`
###