# Projeto em Nodejs para processamento de arquivos

Projeto simples é composto por duas soluções (módulos): processador-arquivo-texto e processador-conteudo-filamensagem, ambos em NodeJs.

# Módulo1 - processador-arquivo-texto
Escuta uma determinada pasta (diretório) processa os arquivos e envia seu conteúdo (linha-a-linha) para fila de mensageria.
Como exemplo utilizei o RabbitMQ com fila de mensageria e arquivos dos Correios (TXT).

[Módulo1](../../tree/master/processador-arquivos-texto)

# Módulo2 - processador-conteudo-filamensageria 
Realiza a leitura de uma fila de mensageria e processa os itens da fila (conteúdo de arquivo).
Como exemplo utilizei o RabbitMQ com fila de mensageria, MongoDB para repositório e arquivos dos Correios (TXT) para processar e carregar na base.

[Módulo2](../../tree/master/processador-conteudo-filamensageria)
