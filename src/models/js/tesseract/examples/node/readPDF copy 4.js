#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const { createWorker } = require('../../');
const { json } = require('express');
const { result } = require('validate.js');

const [,, imagePath] = process.argv;
const image = path.resolve(__dirname, (imagePath || '../../tests/assets/images/teste2.png'));

console.log(`Recognizing ${image}`);


      //const uploader = document.getElementById('uploader');
      //const dlBtn = document.getElementById('download-pdf');
      let pdf;
      const recognize = async ({ target: { files }  }) => {
        const res = await worker.recognize(files[0],{pdfTitle: "Example PDF"},{pdf: true});
        pdf = res.data.pdf;
        const text = res.data.text;
        const board = document.getElementById('board');
        board.value = text;
        dlBtn.disabled = false;
      };

      

(async () => {
  const worker = await createWorker();
  const { data: { text, pdf } } = await worker.recognize(image, {textContent: "Example PDF"}, {pdf: true});    

    const personList = text;    

    const regexpDados = 
/Nome: (?<nome>[\w]+) | Data: (?<data>[\A-Za-z0-9_-]+)| Sexo: (?<sexo>[\w]+)| Data Pag. (?<DataPag>[\A-Za-z0-9_-]+)| Veloc. Papel: (?<VelocPapel>[\w]+)| Idade: (?<idade>[0-9]+)| ID: (?<id>[\w]+)/gm;

    for (const match of personList.matchAll(regexpDados)) {

        if (match.groups.nome){
            console.log(`Nome: ${match.groups.nome}`);
        }
        if (match.groups.data){
            console.log(`Data: ${match.groups.data}`);
        }
        if (match.groups.sexo){
            console.log(`Sexo: ${match.groups.sexo}`);
        }        
        if (match.groups.DataPag){
            console.log(`Data Pag. ${match.groups.DataPag}`);
        }
        if (match.groups.VelocPapel){
            console.log(`Veloc. Papel: ${match.groups.VelocPapel}`);
        }
        if (match.groups.idade){
            console.log(`Idade: ${match.groups.idade}`);
        }
        if (match.groups.id){
            console.log(`ID: ${match.groups.id}`);
        }

    };

  fs.writeFileSync('teste2.pdf', Buffer.from(pdf));
  console.log('Generate PDF: teste2.pdf');
  await worker.terminate();
})();
