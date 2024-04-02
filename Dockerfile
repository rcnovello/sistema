## Comando obrigatório
## Baixa a imagem do node com versão alpine (versão mais simplificada e leve)
FROM node:18

ENV NODE_ENV=production
#ENV NODE_ENV=prod
#Diretório biblioteca Oracle

## Define o local onde o app vai ficar no disco do container
## Pode ser o diretório que você quiser
WORKDIR /usr/app/ComoFazerInformatica

## Copia tudo que começa com package e termina com .json para dentro da pasta WORKDIR
COPY package*.json ./


# Atualize os pacotes e instale o pacote libaio
RUN apt-get update
RUN apt install -y openssh-server
RUN apt-get install nano
RUN apt-get install -y iputils-ping

#Comando para permitir comandos do Git sem ssl
#RUN git config --global http.sslVerify false

#Diretórios necessário para o projeto, re-criar pastas vazias necessários para estrutura do sistema
#Docker não copia pastas vazias.
RUN mkdir -p src/models/docs
RUN mkdir -p src/models/img
RUN mkdir -p src/models/js/tmp
RUN mkdir -p src/logs


#Excluir arquivos temporarios da imagem

## Executa npm install para adicionar as dependências e criar a pasta node_modules
RUN npm install --production

## Copia tudo que está no diretório onde o arquivo Dockerfile está
## para dentro da pasta WORKDIR do container
## Vamos ignorar a node_modules por isso criaremos um .dockerignore
COPY . .


## Container ficará ouvindo os acessos na porta 3000
#EXPOSE 3000

## Não se repete no Dockerfile
## Executa o comando npm start para iniciar o script que que está no package.json
CMD [ "node", "./src/server.js" ]