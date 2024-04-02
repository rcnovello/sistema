#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const { createWorker } = require('../../');
const { json } = require('express');
const { result } = require('validate.js');
const { Console } = require('console');
const pdf2img = require('pdf-img-convert');
const consts = require('../../../../../consts');

/* CONVERTER PDF PARA IMAGEM */

//Parametros de conversão
const conversion_config =
{
  width: 3509, //Number in px
  height: 2481, // Number in px
  page_numbers: [1], // A list of pages to render instead of all of them
  base64: false,
  scale: 1
};

//const cOrigemPDF = 'TESTE_EEG_ARQUIVO_REDE_LOCAL.pdf';

const vOrigemPDF = consts.dirTempEEGRedeLocal;

if(!fs.existsSync(vOrigemPDF)){
  console.log('PDF não disponível');
  return;
};

//var vUrlArqPdfToImage = pdf2img.convert('http://www.example.com/pdf_online.pdf');
//let vOutArqPdfToImage = pdf2img.convert(cOrigemPDF,conversion_config);


const cDestinoOutputImages = path.join(__dirname, `../../../../../${consts.dirTempEEGRedeLocalOutImage}`);

pdf2img.convert(vOrigemPDF,conversion_config).then(function(outputImages) {
for (i = 0; i < outputImages.length; i++)
    fs.writeFile(cDestinoOutputImages+i+".png", outputImages[i], function (error) {
      if (error) { console.error("Error: " + error); }
    });
});

  
/* LER DADOS DA IMAGEM  */

//const [,, imagePath] = process.argv;
//const image = path.resolve(__dirname, (imagePath || 'teste2.png'));
//const image = path.resolve(__dirname, (imagePath || 'output0.png'));
const image = `${cDestinoOutputImages}0.png`;
//const image = path.resolve(__dirname, (imagePath || 'TESTE_EEG_ARQUIVO_REDE_LOCAL.jpg'));

console.log(`Reconhecendo ${image}`);

(async () => {

  const worker = await createWorker();

  //Gerar um PDF com a aimegm capturada
  //const { data: { text, pdf } } = await worker.recognize(image, {textContent: "Example PDF"}, {pdf: true});  
  
  //Não gerar um PDF com a aimegm capturada
  const { data: { text} } = await worker.recognize(image);    

  //console.log(text);

  //Remover quebra linhas
  const removeQuebraLinha = text.replace(/(\r\n|\n|\r)/gm, "");
  //Corrigir campo Hora
  let formataHora = removeQuebraLinha.replace(' Hora:', ' Hora: ');
  
  //console.log(formataHora);

  const personList = formataHora;     

  const regexpDados = /Nome: (?<nome>[\w]+) | Data: (?<data>[\A-Za-z0-9_-]+)| Sexo: (?<sexo>[\w]+)| Data Pag.: (?<DataPag>[\A-Za-z0-9_-]+)| Veloc. Papel: (?<VelocPapel>[\w]+)| IIdade: (?<idade>[\A-Za-z0-9_-]+)| Hora: (?<hora>[\0-9:]+)| ID: (?<id>[\w]+)/gm;

  for (const match of personList.matchAll(regexpDados)) {
    if (match.groups.nome){
        console.log(`Nome: ${match.groups.nome}`);
    }
    if (match.groups.DataPag){
      console.log(`Data Pag.: ${match.groups.DataPag}`);
    }
    if (match.groups.data){
        console.log(`Data: ${match.groups.data}`);
    }
    if (match.groups.VelocPapel){
      console.log(`Veloc. Papel: ${match.groups.VelocPapel}`);
    }
    if (match.groups.idade){
      console.log(`Idade: ${match.groups.idade}`);
    }
    if (match.groups.sexo){
        console.log(`Sexo: ${match.groups.sexo}`);
    }        
    if (match.groups.id){
        console.log(`ID: ${match.groups.id}`);
    }
    if (match.groups.hora){
      console.log(`Hora:${match.groups.hora}`);
    }
  };

  /*
    fs.writeFileSync('teste2.pdf', Buffer.from(pdf));
    console.log('Generate PDF: teste2.pdf');
  */
  await worker.terminate();

})();

